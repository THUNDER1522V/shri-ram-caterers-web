-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0001: Core System Extensions
-- File: supabase/migrations/0001_extensions.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise)
-- ============================================================================
--
-- PURPOSE:
-- Establishes the foundational cryptographic, indexing, search, and AI vector
-- capabilities required across all 20 bounded domains of the 68-table HospiOS.
--
-- EXTENSIONS INCLUDED:
-- 1. uuid-ossp      - RFC 4122 UUID generation functions
-- 2. pgcrypto       - Cryptographic hashing, HMAC signatures & symmetric encryption
-- 3. pg_trgm        - Trigram text similarity & fuzzy search for guest inquiries/menus
-- 4. unaccent       - Diacritic/accent-insensitive text search normalization
-- 5. btree_gin      - Composite GIN indexing combining multi-tenant UUIDs with FTS/trigrams
-- 6. vector         - High-dimensional vector embeddings for AI semantic hospitality search
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. UUID GENERATION: uuid-ossp
-- ----------------------------------------------------------------------------
-- Provides functions to generate universally unique identifiers (UUIDs) based
-- on RFC 4122 standards (uuid_generate_v4(), uuid_generate_v1mc()).
--
-- Role in HospiOS:
-- Primary keys across all tenant-isolated entities use UUIDv4 to eliminate ID
-- enumeration attacks across tenants and allow distributed ID generation.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. CRYPTOGRAPHIC SECURITY: pgcrypto
-- ----------------------------------------------------------------------------
-- Provides cryptographic hashing (digest(), hmac()), symmetric encryption
-- (pgp_sym_encrypt()), and random byte generators.
--
-- Role in HospiOS:
-- - Public API: SHA-256 hashing for API keys (api_keys.key_hash)
-- - Webhook Security: HMAC-SHA256 signature generation for webhook deliveries
-- - Privacy Analytics: Salted daily hashing for cookie-less visitor sessions (analytics_sessions)
-- - Plugin System: Encrypted credential storage for Stripe, Razorpay & WhatsApp tokens
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 3. FUZZY & SIMILARITY SEARCH: pg_trgm
-- ----------------------------------------------------------------------------
-- Provides functions and index operators (gin_trgm_ops) for determining text
-- similarity based on 3-character trigram matching.
--
-- Role in HospiOS:
-- - Culinary Catalog: Typo-tolerant dish and cuisine searching (e.g., matching
--   "paner tikka" -> "Paneer Tikka", "biriyani" -> "Biryani")
-- - CRM & Leads: High-speed substring searches across guest names, phone numbers,
--   event venues, and cities without requiring external search clusters
-- - Media DAM: Fuzzy matching over photo tags, event locations, and captions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 4. TEXT NORMALIZATION: unaccent
-- ----------------------------------------------------------------------------
-- Text search dictionary that removes accents and diacritical marks from letters.
--
-- Role in HospiOS:
-- Luxury culinary and hospitality menus routinely feature accented gastronomic
-- terminology (e.g. "Flambé", "Crème Brûlée", "Café", "Pâtisserie").
-- unaccent ensures guests searching with standard keyboards ("flambe", "creme")
-- achieve instantaneous, accurate matches.
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ----------------------------------------------------------------------------
-- 5. COMPOSITE GIN MULTI-TENANCY INDEXING: btree_gin
-- ----------------------------------------------------------------------------
-- Allows standard PostgreSQL B-Tree data types (UUID, VARCHAR, TIMESTAMPTZ, INT)
-- to be indexed inside GIN (Generalized Inverted Index) data structures.
--
-- Role in HospiOS:
-- In a multi-tenant shared-schema architecture, all search queries MUST be scoped
-- by tenant_id (UUID). Without btree_gin, PostgreSQL CANNOT construct composite GIN
-- indexes that combine tenant_id with full-text search (tsvector) or trigram operators.
-- With btree_gin, we can execute:
--   CREATE INDEX ... ON menu_items USING GIN (tenant_id, name gin_trgm_ops);
-- guaranteeing sub-millisecond multi-tenant filtered search.
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ----------------------------------------------------------------------------
-- 6. AI VECTOR EMBEDDINGS: vector (pgvector)
-- ----------------------------------------------------------------------------
-- Native vector data type and similarity search operators (L2 distance, inner
-- product, cosine distance) for high-dimensional vector embeddings.
--
-- Role in HospiOS:
-- Powers the AI Services domain:
-- - Semantic Culinary Search: Natural language recommendations ("light summer
--   evening cocktail appetizers with citrus notes")
-- - VIP Guest Taste Profiling: Clustering past client dietary preferences to
--   recommend bespoke tasting menus
-- - Automated Review Sentiment: Semantic analysis of client feedback and reviews
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- END OF MIGRATION 0001
-- ============================================================================
