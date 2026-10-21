-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0004: Foundational Tenancy & Identity Tables
-- File: supabase/migrations/0004_foundation_tables.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto, unaccent, btree_gin)
-- - 0002_enums.sql (tenant_business_type, tenant_status, iam_role_key)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id, current_user_id)
--
-- TABLES GENERATED (5 Foundation Tables):
-- 1. tenants
-- 2. tenant_domains
-- 3. tenant_settings
-- 4. users
-- 5. tenant_members
--
-- STANDARDS ENFORCED:
-- - UUIDv4 Primary Keys (gen_random_uuid())
-- - Foreign keys with ON DELETE CASCADE
-- - Automatic updated_at triggers
-- - Soft deletes (deleted_at TIMESTAMPTZ NULL)
-- - Partial B-Tree indexes (WHERE deleted_at IS NULL)
-- - Row Level Security (RLS) enabled on all 5 tables
-- - Multi-tenant RLS policies for public visitors vs authenticated staff
-- - Production table and column comments
-- ============================================================================

-- Ensure auth schema compatibility for environments outside of managed Supabase
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        CREATE SCHEMA auth;
        CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- TABLE 1: tenants
-- ----------------------------------------------------------------------------
-- Core multi-tenant workspace entity representing a catering firm, banquet hall,
-- wedding planner, decorator, or restaurant business.
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    business_type tenant_business_type NOT NULL DEFAULT 'caterer',
    status tenant_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_tenants_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_tenants_slug_length CHECK (char_length(slug) >= 3)
);

-- Comments
COMMENT ON TABLE tenants IS 'Core multi-tenant workspace entity for hospitality brands.';
COMMENT ON COLUMN tenants.id IS 'Immutable UUIDv4 primary key.';
COMMENT ON COLUMN tenants.slug IS 'Unique lowercase URL-safe identifier for tenant routing.';
COMMENT ON COLUMN tenants.legal_name IS 'Official registered company name for taxation and contracts.';
COMMENT ON COLUMN tenants.trade_name IS 'Brand display name presented to clients and public website visitors.';
COMMENT ON COLUMN tenants.business_type IS 'Categorical vertical (caterer, banquet_hall, wedding_planner, etc.).';
COMMENT ON COLUMN tenants.status IS 'Operational lifecycle state (active, suspended, trial, archived).';
COMMENT ON COLUMN tenants.deleted_at IS 'Soft delete timestamp. If populated, workspace is archived.';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_slug_unique 
ON tenants (LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tenants_status 
ON tenants (status) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read for active, non-deleted tenants (needed for domain routing)
CREATE POLICY "Public read for active tenants"
ON tenants FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL AND status = 'active');

-- RLS Policy: Tenant owners/general managers can update their own workspace
CREATE POLICY "Tenant owners can update own workspace"
ON tenants FOR UPDATE
TO authenticated
USING (
    id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 2: tenant_domains
-- ----------------------------------------------------------------------------
-- Maps apex domains, subdomains, and staging environments to tenant workspaces.
CREATE TABLE IF NOT EXISTS tenant_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    ssl_status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_tenant_domains_lowercase CHECK (domain = LOWER(domain))
);

-- Comments
COMMENT ON TABLE tenant_domains IS 'Custom domain and subdomain mappings for white-label multi-tenancy.';
COMMENT ON COLUMN tenant_domains.domain IS 'Normalized lowercase FQDN (e.g. shriramcaterers.com, localhost).';
COMMENT ON COLUMN tenant_domains.is_primary IS 'Primary canonical domain for SEO redirect canonicalization.';
COMMENT ON COLUMN tenant_domains.is_verified IS 'DNS CNAME / A-record verification status.';
COMMENT ON COLUMN tenant_domains.ssl_status IS 'Edge SSL certificate provisioning status (active, pending, failed).';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_domains_unique 
ON tenant_domains (domain) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant_id 
ON tenant_domains (tenant_id) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_tenant_domains_updated_at
BEFORE UPDATE ON tenant_domains
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE tenant_domains ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read for domain resolution in Next.js Edge Middleware
CREATE POLICY "Public read for domain resolution"
ON tenant_domains FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

-- RLS Policy: Tenant admins can manage custom domains
CREATE POLICY "Admins can manage tenant domains"
ON tenant_domains FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 3: tenant_settings
-- ----------------------------------------------------------------------------
-- 1:1 tenant branding, contact coordinates, geo-location, and social profiles.
CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(32) NOT NULL DEFAULT '#C6A15B',
    secondary_color VARCHAR(32) NOT NULL DEFAULT '#4A0A10',
    phone_formatted VARCHAR(32),
    phone_raw VARCHAR(32),
    whatsapp_raw VARCHAR(32),
    whatsapp_prefilled_message TEXT,
    email VARCHAR(255),
    catering_inquiries_email VARCHAR(255),
    address_full TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(64) DEFAULT 'India',
    postal_code VARCHAR(16),
    geo_lat NUMERIC(10, 7),
    geo_lng NUMERIC(10, 7),
    opening_hours VARCHAR(255),
    price_range VARCHAR(16) DEFAULT '₹₹₹₹',
    service_radius TEXT,
    social_links JSONB NOT NULL DEFAULT '{"instagram": "", "google_reviews": "", "youtube": "", "facebook": ""}'::jsonb,
    feature_flags JSONB NOT NULL DEFAULT '{"live_counters": true, "tasting_sessions": true, "video_coverflow": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_tenant_settings_primary_color CHECK (primary_color ~ '^#[A-Fa-f0-9]{6}$'),
    CONSTRAINT chk_tenant_settings_secondary_color CHECK (secondary_color ~ '^#[A-Fa-f0-9]{6}$')
);

-- Comments
COMMENT ON TABLE tenant_settings IS '1:1 brand styling, contact coordinates, and geo-data for tenant website.';
COMMENT ON COLUMN tenant_settings.primary_color IS 'Hex color token for primary brand accent (e.g. Royal Gold #C6A15B).';
COMMENT ON COLUMN tenant_settings.secondary_color IS 'Hex color token for secondary accent (e.g. Deep Burgundy #4A0A10).';
COMMENT ON COLUMN tenant_settings.whatsapp_raw IS 'E.164 formatted international WhatsApp number for click-to-chat CTA.';
COMMENT ON COLUMN tenant_settings.geo_lat IS 'Latitude coordinate for Google Maps venue navigation.';
COMMENT ON COLUMN tenant_settings.geo_lng IS 'Longitude coordinate for Google Maps venue navigation.';

-- Trigger: updated_at
CREATE TRIGGER trg_tenant_settings_updated_at
BEFORE UPDATE ON tenant_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read for active tenant website configuration
CREATE POLICY "Public read for active tenant settings"
ON tenant_settings FOR SELECT
TO anon, authenticated
USING (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

-- RLS Policy: Tenant admins can update branding settings
CREATE POLICY "Admins can update tenant settings"
ON tenant_settings FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 4: users
-- ----------------------------------------------------------------------------
-- User profile entity mirroring and extending Supabase auth.users.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_users_email_lowercase CHECK (email = LOWER(email))
);

-- Comments
COMMENT ON TABLE users IS 'User profiles extending Supabase auth.users with name, phone, and avatar.';
COMMENT ON COLUMN users.id IS 'Direct foreign key reference to Supabase auth.users(id).';
COMMENT ON COLUMN users.email IS 'Normalized lowercase email address matching auth identity.';
COMMENT ON COLUMN users.full_name IS 'Full personal name of staff member or administrator.';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique 
ON users (email) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Authenticated users can view own profile or peer staff in same tenant
CREATE POLICY "Users can read own profile and tenant peers"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() 
    OR id IN (
        SELECT tm.user_id 
        FROM tenant_members tm 
        WHERE tm.tenant_id IN (
            SELECT my_tm.tenant_id 
            FROM tenant_members my_tm 
            WHERE my_tm.user_id = auth.uid() AND my_tm.is_active = true
        )
    )
);

-- RLS Policy: Users can update their own profile details
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- RLS Policy: Service role has unrestricted access (for Auth Webhooks)
CREATE POLICY "Service role full access on users"
ON users FOR ALL
TO service_role
USING (true);

-- ----------------------------------------------------------------------------
-- TABLE 5: tenant_members
-- ----------------------------------------------------------------------------
-- Junction table associating users with tenants under specific enterprise roles.
CREATE TABLE IF NOT EXISTS tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role iam_role_key NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_tenant_members_tenant_user UNIQUE (tenant_id, user_id)
);

-- Comments
COMMENT ON TABLE tenant_members IS 'Staff membership and role assignment within tenant workspaces.';
COMMENT ON COLUMN tenant_members.role IS 'Strongly typed RBAC role (owner, general_manager, sales_manager, executive_chef, etc.).';
COMMENT ON COLUMN tenant_members.is_active IS 'Active status flag; deactivated members cannot access workspace.';
COMMENT ON COLUMN tenant_members.joined_at IS 'Timestamp when the user accepted their invitation.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id 
ON tenant_members (tenant_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id 
ON tenant_members (user_id) 
WHERE is_active = true;

-- Trigger: updated_at
CREATE TRIGGER trg_tenant_members_updated_at
BEFORE UPDATE ON tenant_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Active staff can view membership list for their own workspace
CREATE POLICY "Staff can view peer tenant members"
ON tenant_members FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- RLS Policy: Tenant owners and general managers can invite, update, and manage members
CREATE POLICY "Admins can manage tenant members"
ON tenant_members FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager')
          AND tm.is_active = true
    )
);

-- ============================================================================
-- END OF MIGRATION 0004
-- ============================================================================
