-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0006: Media Library, Social Proof & CRM Lead Pipeline Tables
-- File: supabase/migrations/0006_media_crm_and_reviews.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto, btree_gin, pg_trgm)
-- - 0002_enums.sql (media_type, review_type, review_status, inquiry_status,
--                   inquiry_source, tasting_session_status, inquiry_timeline_event_type)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id)
-- - 0004_foundation_tables.sql (tenants, users, tenant_members)
--
-- TABLES GENERATED (7 Tables):
-- 1. media_assets
-- 2. gallery_categories
-- 3. gallery_items
-- 4. reviews
-- 5. inquiries
-- 6. inquiry_timeline_events
-- 7. tasting_sessions
--
-- ARCHITECTURAL PHASES ENFORCED:
-- Phase A: Create Tables (strict topological creation order)
-- Phase B: Foreign Keys (deferred constraints if applicable)
-- Phase C: Indexes (B-tree, unique partial, and composite GIN FTS indexes)
-- Phase D: Triggers (automatic updated_at maintenance)
-- Phase E: Enable RLS (Row Level Security activation across all tables)
-- Phase F: Policies (idempotent multi-tenant security policies)
-- Phase G: Comments (comprehensive table and column documentation)
-- ============================================================================

-- ============================================================================
-- PHASE A: CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE 1: media_assets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    media_type media_type NOT NULL DEFAULT 'video',
    storage_path TEXT NOT NULL,
    poster_url TEXT,
    aspect_ratio VARCHAR(16) NOT NULL DEFAULT '9/16',
    width INTEGER,
    height INTEGER,
    file_size_bytes BIGINT,
    mime_type VARCHAR(64),
    alt_text VARCHAR(255),
    caption TEXT,
    blurhash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_media_assets_storage_path CHECK (char_length(storage_path) > 0)
);

-- ----------------------------------------------------------------------------
-- TABLE 2: gallery_categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_gallery_categories_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ----------------------------------------------------------------------------
-- TABLE 3: gallery_items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES gallery_categories(id) ON DELETE CASCADE,
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    event_name VARCHAR(128) NOT NULL,
    location VARCHAR(128) NOT NULL,
    event_date DATE NOT NULL,
    event_date_formatted VARCHAR(32),
    tag VARCHAR(64),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- TABLE 4: reviews
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    review_type review_type NOT NULL DEFAULT 'google',
    status review_status NOT NULL DEFAULT 'approved',
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(128),
    event_type VARCHAR(128),
    location VARCHAR(128),
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    quote TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    review_date DATE,
    review_date_formatted VARCHAR(32),
    media_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
    view_count_text VARCHAR(32),
    external_review_id VARCHAR(128),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_reviews_rating_range CHECK (rating >= 1.0 AND rating <= 5.0)
);

-- ----------------------------------------------------------------------------
-- TABLE 5: inquiries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    host_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    event_type VARCHAR(64) NOT NULL,
    event_date DATE,
    event_date_raw VARCHAR(64),
    estimated_guests VARCHAR(32),
    guest_count_num INTEGER,
    venue_city VARCHAR(100),
    venue_name VARCHAR(255),
    estimated_budget NUMERIC(12, 2),
    source inquiry_source NOT NULL DEFAULT 'web_quick_form',
    status inquiry_status NOT NULL DEFAULT 'new',
    assigned_to_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    snapshot_menu_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_inquiries_phone_min CHECK (char_length(phone) >= 7)
);

-- ----------------------------------------------------------------------------
-- TABLE 6: inquiry_timeline_events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiry_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    created_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    event_type inquiry_timeline_event_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 7: tasting_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    attendee_count INTEGER NOT NULL DEFAULT 4,
    host_attendees_names TEXT,
    curated_dishes_ids UUID[] DEFAULT '{}',
    chef_in_charge_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    feedback_notes TEXT,
    status tasting_session_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ============================================================================
-- PHASE B: FOREIGN KEYS (DEFERRED)
-- ============================================================================
-- All media, review, and CRM foreign keys are created in Phase A
-- without circular cross-table dependencies.

-- ============================================================================
-- PHASE C: INDEXES
-- ============================================================================

-- media_assets indexes
CREATE INDEX IF NOT EXISTS idx_media_assets_tenant_type 
ON media_assets (tenant_id, media_type) 
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_assets_tenant_path 
ON media_assets (tenant_id, storage_path) 
WHERE deleted_at IS NULL;

-- gallery_categories indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_categories_slug 
ON gallery_categories (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gallery_categories_display 
ON gallery_categories (tenant_id, display_order) 
WHERE deleted_at IS NULL;

-- gallery_items indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_tenant_cat 
ON gallery_items (tenant_id, category_id, display_order) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_gallery_items_featured 
ON gallery_items (tenant_id, is_featured) 
WHERE deleted_at IS NULL AND is_featured = true;

CREATE INDEX IF NOT EXISTS idx_gallery_items_fts 
ON gallery_items USING GIN (
    tenant_id extensions.uuid_ops, 
    (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(event_name, '') || ' ' || coalesce(location, '')))
) 
WHERE deleted_at IS NULL;

-- reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_published 
ON reviews (tenant_id, is_published, display_order) 
WHERE deleted_at IS NULL AND is_published = true AND status = 'approved';

-- inquiries indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_tenant_status 
ON inquiries (tenant_id, status) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at 
ON inquiries (tenant_id, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inquiries_assigned 
ON inquiries (assigned_to_user_id) 
WHERE deleted_at IS NULL AND assigned_to_user_id IS NOT NULL;

-- inquiry_timeline_events indexes
CREATE INDEX IF NOT EXISTS idx_inquiry_events_inquiry 
ON inquiry_timeline_events (inquiry_id, created_at DESC);

-- tasting_sessions indexes
CREATE INDEX IF NOT EXISTS idx_tasting_sessions_tenant 
ON tasting_sessions (tenant_id, scheduled_at) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tasting_sessions_inquiry 
ON tasting_sessions (inquiry_id) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- PHASE D: TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_media_assets_updated_at ON media_assets;
CREATE TRIGGER trg_media_assets_updated_at
BEFORE UPDATE ON media_assets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_gallery_categories_updated_at ON gallery_categories;
CREATE TRIGGER trg_gallery_categories_updated_at
BEFORE UPDATE ON gallery_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON gallery_items;
CREATE TRIGGER trg_gallery_items_updated_at
BEFORE UPDATE ON gallery_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews;
CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries;
CREATE TRIGGER trg_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tasting_sessions_updated_at ON tasting_sessions;
CREATE TRIGGER trg_tasting_sessions_updated_at
BEFORE UPDATE ON tasting_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE E: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE F: POLICIES
-- ============================================================================

-- 1. media_assets policies
DROP POLICY IF EXISTS "Public read for active media assets" ON media_assets;
CREATE POLICY "Public read for active media assets"
ON media_assets FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage media assets" ON media_assets;
CREATE POLICY "Staff can manage media assets"
ON media_assets FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'photographer', 'content_editor')
          AND tm.is_active = true
    )
);

-- 2. gallery_categories policies
DROP POLICY IF EXISTS "Public read for active gallery categories" ON gallery_categories;
CREATE POLICY "Public read for active gallery categories"
ON gallery_categories FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage gallery categories" ON gallery_categories;
CREATE POLICY "Staff can manage gallery categories"
ON gallery_categories FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor', 'photographer')
          AND tm.is_active = true
    )
);

-- 3. gallery_items policies
DROP POLICY IF EXISTS "Public read for active gallery items" ON gallery_items;
CREATE POLICY "Public read for active gallery items"
ON gallery_items FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage gallery items" ON gallery_items;
CREATE POLICY "Staff can manage gallery items"
ON gallery_items FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor', 'photographer')
          AND tm.is_active = true
    )
);

-- 4. reviews policies
DROP POLICY IF EXISTS "Public read for approved and published reviews" ON reviews;
CREATE POLICY "Public read for approved and published reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_published = true 
    AND status = 'approved'
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Public guests can submit reviews for moderation" ON reviews;
CREATE POLICY "Public guests can submit reviews for moderation"
ON reviews FOR INSERT
TO anon, authenticated
WITH CHECK (
    status = 'pending' 
    AND is_published = false
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage and moderate reviews" ON reviews;
CREATE POLICY "Staff can manage and moderate reviews"
ON reviews FOR ALL
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

-- 5. inquiries policies
DROP POLICY IF EXISTS "Public guests can submit inquiries" ON inquiries;
CREATE POLICY "Public guests can submit inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can view and manage tenant inquiries" ON inquiries;
CREATE POLICY "Staff can view and manage tenant inquiries"
ON inquiries FOR ALL
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

-- 6. inquiry_timeline_events policies
DROP POLICY IF EXISTS "Staff can view and append inquiry timeline events" ON inquiry_timeline_events;
CREATE POLICY "Staff can view and append inquiry timeline events"
ON inquiry_timeline_events FOR ALL
TO authenticated
USING (
    inquiry_id IN (
        SELECT i.id 
        FROM inquiries i 
        JOIN tenant_members tm ON tm.tenant_id = i.tenant_id 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'sales_manager')
          AND tm.is_active = true
    )
);

-- 7. tasting_sessions policies
DROP POLICY IF EXISTS "Staff and chefs can view and manage tasting sessions" ON tasting_sessions;
CREATE POLICY "Staff and chefs can view and manage tasting sessions"
ON tasting_sessions FOR ALL
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'sales_manager', 'executive_chef')
          AND tm.is_active = true
    )
);

-- ============================================================================
-- PHASE G: COMMENTS
-- ============================================================================

-- media_assets comments
COMMENT ON TABLE media_assets IS 'Centralized binary media asset metadata for videos, photos, and documents.';
COMMENT ON COLUMN media_assets.storage_path IS 'S3 bucket relative object key (e.g. /shriram/hero/royal_wedding.mp4).';
COMMENT ON COLUMN media_assets.blurhash IS 'Compact string representation of placeholder blurhash for instant perceived load.';
COMMENT ON COLUMN media_assets.aspect_ratio IS 'Display ratio string (e.g. 9/16, 16/9, 1/1, 4/3).';

-- gallery_categories comments
COMMENT ON TABLE gallery_categories IS 'Portfolio categories for visual event galleries and client case studies.';

-- gallery_items comments
COMMENT ON TABLE gallery_items IS 'Event showcase cards linking media assets, locations, and client stories.';
COMMENT ON COLUMN gallery_items.is_featured IS 'Flag for promotion to homepage masonry portfolio.';

-- reviews comments
COMMENT ON TABLE reviews IS 'Social proof repository supporting Google syndicated reviews and client video testimonials.';
COMMENT ON COLUMN reviews.rating IS 'Star rating scale from 1.0 to 5.0.';
COMMENT ON COLUMN reviews.media_asset_id IS 'Optional video testimonial asset reference.';

-- inquiries comments
COMMENT ON TABLE inquiries IS 'Inbound client leads and banquet booking inquiries.';
COMMENT ON COLUMN inquiries.status IS 'Sales pipeline state (new, contacted, tasting_scheduled, proposal_sent, confirmed, lost).';
COMMENT ON COLUMN inquiries.assigned_to_user_id IS 'Sales manager or concierge handling the lead.';
COMMENT ON COLUMN inquiries.snapshot_menu_data IS 'Frozen snapshot of guest-selected dishes and live counters at time of inquiry.';

-- inquiry_timeline_events comments
COMMENT ON TABLE inquiry_timeline_events IS 'Chronological audit trail of sales calls, WhatsApp updates, and status advancements.';

-- tasting_sessions comments
COMMENT ON TABLE tasting_sessions IS 'VIP food tasting appointments, curated dish selections, and executive chef feedback.';
COMMENT ON COLUMN tasting_sessions.curated_dishes_ids IS 'Array of menu_item UUIDs selected by host for tasting.';
COMMENT ON COLUMN tasting_sessions.chef_in_charge_user_id IS 'Executive chef assigned to prepare and host the tasting.';

-- ============================================================================
-- END OF MIGRATION 0006
-- ============================================================================
