-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0003: Core Reusable PostgreSQL Functions & Triggers
-- File: supabase/migrations/0003_functions.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise)
-- ============================================================================
--
-- PURPOSE:
-- Establishes centralized, reusable PostgreSQL helper functions, trigger handlers,
-- tenancy context resolvers, slug generators, and cryptographic helpers utilized
-- across all 20 bounded domains of the 68-table HospiOS architecture.
--
-- DO NOT CREATE TABLES IN THIS MIGRATION.
-- DO NOT GENERATE RLS POLICIES IN THIS MIGRATION.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TIMESTAMP AUTOMATION: update_updated_at_column()
-- ----------------------------------------------------------------------------
-- Automatically synchronizes the updated_at column to NOW() before any UPDATE.
-- Ensures strict auditability and deterministic cache invalidation timestamps.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 
'Trigger handler that updates the updated_at timestamp column to current time on record mutation.';

-- ----------------------------------------------------------------------------
-- 2. TENANCY RESOLUTION: current_tenant_id()
-- ----------------------------------------------------------------------------
-- Resolves the active tenant UUID from:
--   1. Direct session variable set by Edge Middleware (app.current_tenant_id)
--   2. Supabase Auth JWT claims (request.jwt.claims -> app_metadata -> tenant_id)
--
-- Returns NULL if unauthenticated or not scoped to a specific tenant workspace.
-- Marked STABLE and SECURITY DEFINER for sub-millisecond, secure evaluation.
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
DECLARE
    _tenant_id TEXT;
BEGIN
    -- 1. Check direct session setting injected by Next.js Edge Middleware
    _tenant_id := current_setting('app.current_tenant_id', true);
    IF _tenant_id IS NOT NULL AND _tenant_id <> '' THEN
        RETURN _tenant_id::UUID;
    END IF;

    -- 2. Check Supabase Auth JWT app_metadata claim
    BEGIN
        _tenant_id := (nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'app_metadata' ->> 'tenant_id');
        IF _tenant_id IS NOT NULL AND _tenant_id <> '' THEN
            RETURN _tenant_id::UUID;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Fallthrough gracefully if JWT claim string is malformed
    END;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION current_tenant_id() IS 
'Resolves the active tenant UUID from request session settings or JWT app_metadata claims.';

-- ----------------------------------------------------------------------------
-- 3. IDENTITY RESOLUTION: current_user_id()
-- ----------------------------------------------------------------------------
-- Safely extracts the authenticated Supabase user UUID (auth.users.id) from
-- request JWT claims without throwing exceptions on unauthenticated visitor queries.
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
DECLARE
    _user_id TEXT;
BEGIN
    _user_id := NULLIF(
        COALESCE(
            current_setting('request.jwt.claim.sub', true),
            (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
        ),
        ''
    );

    IF _user_id IS NOT NULL THEN
        RETURN _user_id::UUID;
    END IF;

    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION current_user_id() IS 
'Extracts authenticated Supabase user UUID (sub claim) from JWT or returns NULL for guests.';

-- ----------------------------------------------------------------------------
-- 4. URL SLUG GENERATION: generate_slug()
-- ----------------------------------------------------------------------------
-- Generates clean, SEO-friendly, URL-safe slugs from raw text:
--   - Unaccents diacritics via unaccent extension ("Flambé" -> "Flambe")
--   - Lowercases text
--   - Replaces non-alphanumeric characters with hyphens
--   - Collapses duplicate hyphens
--   - Trims leading and trailing hyphens
--
-- Used for: cuisine_regions, services, hero_campaigns, cms_pages, media_folders.
CREATE OR REPLACE FUNCTION generate_slug(source_text TEXT)
RETURNS TEXT AS $$
DECLARE
    _clean_text TEXT;
BEGIN
    IF source_text IS NULL OR TRIM(source_text) = '' THEN
        RETURN '';
    END IF;

    -- 1. Remove diacritical marks/accents
    _clean_text := unaccent(source_text);
    -- 2. Lowercase
    _clean_text := LOWER(_clean_text);
    -- 3. Replace non-alphanumeric characters with hyphens
    _clean_text := regexp_replace(_clean_text, '[^a-z0-9]+', '-', 'g');
    -- 4. Collapse consecutive hyphens
    _clean_text := regexp_replace(_clean_text, '-+', '-', 'g');
    -- 5. Trim leading and trailing hyphens
    _clean_text := regexp_replace(_clean_text, '^-+|-+$', '', 'g');

    RETURN _clean_text;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

COMMENT ON FUNCTION generate_slug(TEXT) IS 
'Transforms any string into a clean, unaccented, lowercase URL-safe slug.';

-- ----------------------------------------------------------------------------
-- 5. SOFT DELETE FILTER HELPER: is_not_deleted()
-- ----------------------------------------------------------------------------
-- Micro-helper for index conditions and view filters checking deleted_at IS NULL.
CREATE OR REPLACE FUNCTION is_not_deleted(deleted_at TIMESTAMPTZ)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_not_deleted(TIMESTAMPTZ) IS 
'Returns true if the record has not been soft-deleted (deleted_at IS NULL).';

-- ----------------------------------------------------------------------------
-- 6. CRYPTOGRAPHIC API KEY HASHING: hash_api_key()
-- ----------------------------------------------------------------------------
-- Generates a deterministic SHA-256 hex digest for incoming external API keys.
-- The raw secret is never stored in the database; only the SHA-256 hash is retained.
CREATE OR REPLACE FUNCTION hash_api_key(raw_key TEXT)
RETURNS TEXT AS $$
BEGIN
    IF raw_key IS NULL OR raw_key = '' THEN
        RETURN NULL;
    END IF;
    RETURN encode(digest(raw_key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

COMMENT ON FUNCTION hash_api_key(TEXT) IS 
'Generates a SHA-256 cryptographic hex digest for API key verification.';

-- ----------------------------------------------------------------------------
-- 7. AUDIT LOGGING HELPER: get_client_ip()
-- ----------------------------------------------------------------------------
-- Extracts the client IP address from request headers forwarded by Vercel / Cloudflare
-- (e.g. x-forwarded-for or cf-connecting-ip) for audit_logs and auth_login_history.
CREATE OR REPLACE FUNCTION get_client_ip()
RETURNS INET AS $$
DECLARE
    _ip_header TEXT;
BEGIN
    _ip_header := current_setting('request.headers', true)::jsonb ->> 'cf-connecting-ip';
    IF _ip_header IS NULL OR _ip_header = '' THEN
        _ip_header := split_part(current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for', ',', 1);
    END IF;

    IF _ip_header IS NOT NULL AND _ip_header <> '' THEN
        RETURN TRIM(_ip_header)::INET;
    END IF;

    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_client_ip() IS 
'Extracts client IP address from Vercel/Cloudflare headers for audit trails.';

-- ============================================================================
-- END OF MIGRATION 0003
-- ============================================================================
