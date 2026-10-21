-- ============================================================================
-- WHITE-LABEL HOSPITALITY CMS: CORE DATABASE SCHEMA
-- Migration: 20261021000000_create_hospitality_cms_schema.sql
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================================================

-- Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 0. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- MODULE 1: TENANCY & WHITE-LABEL CONFIGURATION
-- ----------------------------------------------------------------------------

-- Table 1: tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL DEFAULT 'caterer', -- caterer, banquet_hall, wedding_planner, decorator, restaurant
    status VARCHAR(32) NOT NULL DEFAULT 'active',         -- active, suspended, trial, archived
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 2: tenant_domains
CREATE TABLE IF NOT EXISTS tenant_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL, -- e.g. shriramcaterers.com, localhost
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    ssl_status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_domains_domain ON tenant_domains(LOWER(domain)) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant ON tenant_domains(tenant_id);

CREATE TRIGGER trg_tenant_domains_updated_at
BEFORE UPDATE ON tenant_domains
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 3: tenant_settings
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_tenant_settings_updated_at
BEFORE UPDATE ON tenant_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 2: IAM & USER PROFILES
-- ----------------------------------------------------------------------------

-- Table 4: users (profile extending auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- references auth.users(id) in Supabase production
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 5: tenant_members
CREATE TABLE IF NOT EXISTS tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'viewer', -- owner, admin, sales_manager, head_chef, floor_captain, viewer
    is_active BOOLEAN NOT NULL DEFAULT true,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_members_tenant_user ON tenant_members(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON tenant_members(user_id);

CREATE TRIGGER trg_tenant_members_updated_at
BEFORE UPDATE ON tenant_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 3: CUISINES, CATALOG & LIVE FOOD THEATRES
-- ----------------------------------------------------------------------------

-- Table 6: cuisine_regions
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
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cuisine_regions_tenant_slug ON cuisine_regions(tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cuisine_regions_display ON cuisine_regions(tenant_id, display_order);

CREATE TRIGGER trg_cuisine_regions_updated_at
BEFORE UPDATE ON cuisine_regions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 7: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    cuisine_region_id UUID REFERENCES cuisine_regions(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    course_type VARCHAR(32) NOT NULL DEFAULT 'main_course', -- starter, main_course, bread, rice, dessert, beverage, accompaniment
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

CREATE INDEX IF NOT EXISTS idx_menu_items_tenant_course ON menu_items(tenant_id, course_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_menu_items_cuisine ON menu_items(cuisine_region_id) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 8: live_counters
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
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_live_counters_tenant_slug ON live_counters(tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_live_counters_display ON live_counters(tenant_id, display_order);

CREATE TRIGGER trg_live_counters_updated_at
BEFORE UPDATE ON live_counters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 9: live_counter_specialties
CREATE TABLE IF NOT EXISTS live_counter_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_counter_id UUID NOT NULL REFERENCES live_counters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_counter_spec_counter ON live_counter_specialties(live_counter_id, display_order);

-- ----------------------------------------------------------------------------
-- MODULE 4: SERVICES & PACKAGES
-- ----------------------------------------------------------------------------

-- Table 10: services
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
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_tenant_slug ON services(tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_display ON services(tenant_id, display_order);

CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 11: service_features
CREATE TABLE IF NOT EXISTS service_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    feature_text VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_features_service ON service_features(service_id, display_order);

-- Table 12: service_packages
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_service_packages_tenant ON service_packages(tenant_id, is_active) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_service_packages_updated_at
BEFORE UPDATE ON service_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 5: MEDIA ASSETS & VISUAL GALLERIES
-- ----------------------------------------------------------------------------

-- Table 13: media_assets
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL DEFAULT 'video', -- video, image, youtube, instagram
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
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_tenant_type ON media_assets(tenant_id, media_type) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_media_assets_updated_at
BEFORE UPDATE ON media_assets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 14: gallery_categories
CREATE TABLE IF NOT EXISTS gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_categories_slug ON gallery_categories(tenant_id, slug) WHERE deleted_at IS NULL;

-- Table 15: gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES gallery_categories(id),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id),
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

CREATE INDEX IF NOT EXISTS idx_gallery_items_tenant_cat ON gallery_items(tenant_id, category_id, display_order) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_gallery_items_updated_at
BEFORE UPDATE ON gallery_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 6: LEADS & TASTING CRM
-- ----------------------------------------------------------------------------

-- Table 16: inquiries
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
    source VARCHAR(32) NOT NULL DEFAULT 'web_quick_form',
    status VARCHAR(32) NOT NULL DEFAULT 'new', -- new, contacted, tasting_scheduled, proposal_sent, confirmed, lost
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    snapshot_menu_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_tenant_status ON inquiries(tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

CREATE TRIGGER trg_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 17: inquiry_timeline_events
CREATE TABLE IF NOT EXISTS inquiry_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(32) NOT NULL, -- status_change, call_log, whatsapp_sent, internal_note, tasting_booked
    title VARCHAR(255) NOT NULL,
    details TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiry_events_inquiry ON inquiry_timeline_events(inquiry_id, created_at DESC);

-- Table 18: tasting_sessions
CREATE TABLE IF NOT EXISTS tasting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    attendee_count INTEGER NOT NULL DEFAULT 4,
    host_attendees_names TEXT,
    curated_dishes_ids UUID[] DEFAULT '{}',
    chef_in_charge_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feedback_notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_tasting_sessions_tenant ON tasting_sessions(tenant_id, scheduled_at) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_tasting_sessions_updated_at
BEFORE UPDATE ON tasting_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 7: REVIEWS & SOCIAL PROOF
-- ----------------------------------------------------------------------------

-- Table 19: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    review_type VARCHAR(20) NOT NULL DEFAULT 'google', -- google, video, image
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(128),
    event_type VARCHAR(128),
    location VARCHAR(128),
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    quote TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    review_date DATE,
    review_date_formatted VARCHAR(32),
    media_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    view_count_text VARCHAR(32),
    external_review_id VARCHAR(128),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_tenant_published ON reviews(tenant_id, is_published, display_order) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 8: CONTENT MANAGEMENT & FAQS
-- ----------------------------------------------------------------------------

-- Table 20: process_steps
CREATE TABLE IF NOT EXISTS process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    step_number VARCHAR(8) NOT NULL,
    title VARCHAR(128) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    icon_name VARCHAR(32),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_steps_tenant ON process_steps(tenant_id, display_order);

CREATE TRIGGER trg_process_steps_updated_at
BEFORE UPDATE ON process_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 21: faq_categories
CREATE TABLE IF NOT EXISTS faq_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_faq_categories_slug ON faq_categories(tenant_id, slug);

-- Table 22: faqs
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_faqs_tenant_published ON faqs(tenant_id, is_published, display_order) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- MODULE 9: AUDITING & IMMUTABLE ACTIVITY LOGS
-- ----------------------------------------------------------------------------

-- Table 23: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(32),
    action VARCHAR(32) NOT NULL, -- INSERT, UPDATE, DELETE, LOGIN, STATUS_CHANGE
    table_name VARCHAR(64) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_table ON audit_logs(tenant_id, table_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(record_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS across all 23 tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisine_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_counter_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if currently authenticated user belongs to tenant
CREATE OR REPLACE FUNCTION is_tenant_member(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_members.tenant_id = check_tenant_id
        AND tenant_members.user_id = auth.uid()
        AND tenant_members.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Public Tenant Resolution: allow resolving domains for website routing
CREATE POLICY "Public domain resolution" ON tenant_domains
FOR SELECT USING (deleted_at IS NULL);

-- 2. Public Read Policies for published marketing catalog
CREATE POLICY "Public read active tenant settings" ON tenant_settings
FOR SELECT USING (true);

CREATE POLICY "Public read active cuisine regions" ON cuisine_regions
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Public read active menu items" ON menu_items
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Public read active live counters" ON live_counters
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Public read live counter specialties" ON live_counter_specialties
FOR SELECT USING (true);

CREATE POLICY "Public read active services" ON services
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Public read service features" ON service_features
FOR SELECT USING (true);

CREATE POLICY "Public read active media assets" ON media_assets
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Public read gallery categories" ON gallery_categories
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Public read gallery items" ON gallery_items
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Public read published reviews" ON reviews
FOR SELECT USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "Public read process steps" ON process_steps
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read faq categories" ON faq_categories
FOR SELECT USING (true);

CREATE POLICY "Public read published faqs" ON faqs
FOR SELECT USING (is_published = true AND deleted_at IS NULL);

-- 3. Public Lead Ingestion: prospective hosts can submit booking forms
CREATE POLICY "Public insert inquiries" ON inquiries
FOR INSERT WITH CHECK (true);

-- 4. Staff Management Policies (Full control for authorized tenant staff)
CREATE POLICY "Staff manage tenant settings" ON tenant_settings
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage cuisine regions" ON cuisine_regions
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage menu items" ON menu_items
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage live counters" ON live_counters
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage services" ON services
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage packages" ON service_packages
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage media" ON media_assets
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage gallery" ON gallery_items
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage inquiries" ON inquiries
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage inquiry timeline" ON inquiry_timeline_events
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM inquiries
        WHERE inquiries.id = inquiry_timeline_events.inquiry_id
        AND is_tenant_member(inquiries.tenant_id)
    )
);

CREATE POLICY "Staff manage tastings" ON tasting_sessions
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage reviews" ON reviews
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff manage faqs" ON faqs
FOR ALL USING (is_tenant_member(tenant_id));

CREATE POLICY "Staff view audit logs" ON audit_logs
FOR SELECT USING (is_tenant_member(tenant_id));
