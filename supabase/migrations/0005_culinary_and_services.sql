-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0005: Culinary Catalog & Hospitality Services Tables
-- File: supabase/migrations/0005_culinary_and_services.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto, btree_gin, pg_trgm, unaccent)
-- - 0002_enums.sql (course_type, service_tier_type, iam_role_key)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id)
-- - 0004_foundation_tables.sql (tenants, tenant_members)
--
-- TABLES GENERATED (7 Culinary & Service Tables):
-- 1. cuisine_regions
-- 2. menu_items
-- 3. live_counters
-- 4. live_counter_specialties
-- 5. services
-- 6. service_features
-- 7. service_packages
--
-- STANDARDS ENFORCED:
-- - UUIDv4 Primary Keys
-- - Foreign keys with ON DELETE CASCADE and ON DELETE SET NULL
-- - Soft deletes (deleted_at) on all primary catalog entities
-- - Triggers invoking update_updated_at_column()
-- - Multi-tenant Row Level Security (RLS) on all 7 tables
-- - Multi-column composite GIN and B-Tree indexes
-- - Exhaustive comments for database documentation
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE 1: cuisine_regions
-- ----------------------------------------------------------------------------
-- Regional culinary traditions and showcases (e.g. Royal Awadhi, Marwari, Coastal).
CREATE TABLE IF NOT EXISTS cuisine_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    region VARCHAR(64) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    cover_image_url TEXT,
    video_url TEXT,
    dietary_badges TEXT[] DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_cuisine_regions_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comments
COMMENT ON TABLE cuisine_regions IS 'Regional gastronomic heritage and culinary showcase categories.';
COMMENT ON COLUMN cuisine_regions.slug IS 'Lowercase URL slug for regional cuisine storytelling.';
COMMENT ON COLUMN cuisine_regions.region IS 'Geographic origin (Awadh, Marwar, Coastal, Pan-Asian, Continental).';
COMMENT ON COLUMN cuisine_regions.dietary_badges IS 'Array of dietary badges (e.g. 100% Pure Vegetarian, Jain Available, Sattvic Certified).';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cuisine_regions_tenant_slug 
ON cuisine_regions (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cuisine_regions_display 
ON cuisine_regions (tenant_id, display_order) 
WHERE deleted_at IS NULL AND is_active = true;

-- Trigger: updated_at
CREATE TRIGGER trg_cuisine_regions_updated_at
BEFORE UPDATE ON cuisine_regions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE cuisine_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active cuisine regions"
ON cuisine_regions FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Admins and chefs can manage cuisine regions"
ON cuisine_regions FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'executive_chef', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 2: menu_items
-- ----------------------------------------------------------------------------
-- Discrete banquet and catering dishes with allergen profiles and dietary flags.
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    cuisine_region_id UUID NULL REFERENCES cuisine_regions(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    course_type course_type NOT NULL DEFAULT 'main_course',
    description TEXT,
    is_pure_veg BOOLEAN NOT NULL DEFAULT true,
    is_jain_available BOOLEAN NOT NULL DEFAULT true,
    is_sattvic_available BOOLEAN NOT NULL DEFAULT false,
    is_signature BOOLEAN NOT NULL DEFAULT false,
    allergens TEXT[] DEFAULT '{}',
    image_url TEXT,
    preparation_method TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- Comments
COMMENT ON TABLE menu_items IS 'Discrete culinary dishes cataloged by course, dietary classification, and allergens.';
COMMENT ON COLUMN menu_items.course_type IS 'Gastronomic sequencing enum (starter, main_course, bread, rice, dessert, beverage, accompaniment).';
COMMENT ON COLUMN menu_items.is_signature IS 'Flag identifying chef signature and award-winning recipes.';
COMMENT ON COLUMN menu_items.allergens IS 'Allergen flags (e.g. Dairy, Gluten, Nuts, Soy).';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_tenant_course 
ON menu_items (tenant_id, course_type, display_order) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_menu_items_cuisine 
ON menu_items (cuisine_region_id) 
WHERE deleted_at IS NULL;

-- Multi-tenant Full-Text Search composite GIN index (enabled via btree_gin)
CREATE INDEX IF NOT EXISTS idx_menu_items_fts_search 
ON menu_items USING GIN (
    tenant_id, 
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active menu items"
ON menu_items FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Admins and chefs can manage menu items"
ON menu_items FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'executive_chef', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 3: live_counters
-- ----------------------------------------------------------------------------
-- Interactive live food theater stations (Woodfired ovens, Flambé, Chaat, Tawa).
CREATE TABLE IF NOT EXISTS live_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    badge VARCHAR(32),
    description TEXT,
    chef_note TEXT,
    video_url TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_live_counters_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comments
COMMENT ON TABLE live_counters IS 'Live interactive culinary theater stations operated during luxury banquets.';
COMMENT ON COLUMN live_counters.tag IS 'Short category badge (e.g. Italian Artisan, Awadhi Tawa, Molecular Chaat).';
COMMENT ON COLUMN live_counters.chef_note IS 'Executive chef quote or performance description for the counter.';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_counters_tenant_slug 
ON live_counters (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_live_counters_display 
ON live_counters (tenant_id, display_order) 
WHERE deleted_at IS NULL AND is_active = true;

-- Trigger: updated_at
CREATE TRIGGER trg_live_counters_updated_at
BEFORE UPDATE ON live_counters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE live_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active live counters"
ON live_counters FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Admins and chefs can manage live counters"
ON live_counters FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'executive_chef', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 4: live_counter_specialties
-- ----------------------------------------------------------------------------
-- Normalized specialty highlights and performance deliverables per live counter.
CREATE TABLE IF NOT EXISTS live_counter_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_counter_id UUID NOT NULL REFERENCES live_counters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE live_counter_specialties IS 'Performance highlights and signature dish items per live food counter.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_counter_spec_counter 
ON live_counter_specialties (live_counter_id, display_order);

-- Row Level Security
ALTER TABLE live_counter_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for live counter specialties"
ON live_counter_specialties FOR SELECT
TO anon, authenticated
USING (
    live_counter_id IN (
        SELECT lc.id 
        FROM live_counters lc 
        WHERE lc.deleted_at IS NULL AND lc.is_active = true
    )
);

CREATE POLICY "Admins and chefs can manage live counter specialties"
ON live_counter_specialties FOR ALL
TO authenticated
USING (
    live_counter_id IN (
        SELECT lc.id 
        FROM live_counters lc 
        JOIN tenant_members tm ON tm.tenant_id = lc.tenant_id
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'executive_chef', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 5: services
-- ----------------------------------------------------------------------------
-- Core hospitality offerings (Royal Weddings, Corporate Galas, Private Dining).
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    capacity_range VARCHAR(64),
    video_url TEXT,
    poster_url TEXT,
    button_text VARCHAR(64) DEFAULT 'Inquire for Event',
    button_href VARCHAR(255) DEFAULT '#contact',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_services_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comments
COMMENT ON TABLE services IS 'Hospitality service offerings and event celebration categories.';
COMMENT ON COLUMN services.capacity_range IS 'Guest capacity bandwidth (e.g. 500 - 5,000 Guests).';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_services_tenant_slug 
ON services (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_services_display 
ON services (tenant_id, display_order) 
WHERE deleted_at IS NULL AND is_active = true;

-- Trigger: updated_at
CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active services"
ON services FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Admins can manage services"
ON services FOR ALL
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
-- TABLE 6: service_features
-- ----------------------------------------------------------------------------
-- Normalized deliverable bullet points, inclusions, and ratios per service.
CREATE TABLE IF NOT EXISTS service_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    feature_text VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE service_features IS 'Inclusions, hospitality deliverables, and service ratios per offering.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_features_service 
ON service_features (service_id, display_order);

-- Row Level Security
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for service features"
ON service_features FOR SELECT
TO anon, authenticated
USING (
    service_id IN (
        SELECT s.id 
        FROM services s 
        WHERE s.deleted_at IS NULL AND s.is_active = true
    )
);

CREATE POLICY "Admins can manage service features"
ON service_features FOR ALL
TO authenticated
USING (
    service_id IN (
        SELECT s.id 
        FROM services s 
        JOIN tenant_members tm ON tm.tenant_id = s.tenant_id
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 7: service_packages
-- ----------------------------------------------------------------------------
-- Tiered banquet packages with per-plate pricing, currency, and inclusions.
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID NULL REFERENCES services(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    price_per_plate NUMERIC(10, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    min_guests INTEGER DEFAULT 100,
    max_guests INTEGER,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- Comments
COMMENT ON TABLE service_packages IS 'Tiered hospitality pricing packages per plate with guest minimums.';
COMMENT ON COLUMN service_packages.price_per_plate IS 'Base plate price before applicable taxes.';
COMMENT ON COLUMN service_packages.inclusions IS 'JSON array of curated inclusions and menu courses.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_packages_tenant 
ON service_packages (tenant_id, is_active) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_packages_service 
ON service_packages (service_id) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_service_packages_updated_at
BEFORE UPDATE ON service_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active packages"
ON service_packages FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Admins can manage service packages"
ON service_packages FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'sales_manager')
          AND tm.is_active = true
    )
);

-- ============================================================================
-- END OF MIGRATION 0005
-- ============================================================================
