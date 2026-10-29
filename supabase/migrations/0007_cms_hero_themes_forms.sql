-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0007: Website Builder, Hero CMS, Themes, Navigation & Dynamic Forms
-- File: supabase/migrations/0007_cms_hero_themes_forms.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto)
-- - 0002_enums.sql (cms_page_type, cms_publish_status, theme_mode,
--                   hero_campaign_type, hero_media_type, hero_layout_style,
--                   navigation_location, navigation_item_type,
--                   robots_directive, twitter_card_type, form_field_type,
--                   form_submission_status, spam_protection_type)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id)
-- - 0004_foundation_tables.sql (tenants, users, tenant_members)
-- - 0006_media_crm_and_reviews.sql (media_assets, inquiries)
--
-- TABLES GENERATED (12 Tables):
--  1. themes
--  2. seo_metadata
--  3. cms_pages
--  4. cms_sections
--  5. cms_dynamic_blocks
--  6. hero_campaigns
--  7. hero_slides
--  8. navigation_menus
--  9. navigation_items
-- 10. forms
-- 11. form_fields
-- 12. form_submissions
--
-- ARCHITECTURAL PHASES ENFORCED:
-- Phase A: Create Tables (strict topological creation order)
-- Phase B: Foreign Keys (deferred constraints if applicable)
-- Phase C: Indexes (B-tree, unique partial, and composite indexes)
-- Phase D: Triggers (automatic updated_at maintenance)
-- Phase E: Enable RLS (Row Level Security activation across all tables)
-- Phase F: Policies (idempotent multi-tenant security policies)
-- Phase G: Comments (comprehensive table and column documentation)
-- ============================================================================

-- ============================================================================
-- PHASE A: CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE 1: themes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    mode theme_mode NOT NULL DEFAULT 'dark_luxury',
    is_active BOOLEAN NOT NULL DEFAULT false,
    is_system_preset BOOLEAN NOT NULL DEFAULT false,
    color_tokens JSONB NOT NULL DEFAULT '{"primary": "#C6A15B", "secondary": "#4A0A10", "accent": "#E6CA85", "background": "#0D0A08", "surface": "#1A1412", "text": "#FFFFFF", "text_muted": "#A89F91"}'::jsonb,
    typography_tokens JSONB NOT NULL DEFAULT '{"font_heading": "Playfair Display", "font_body": "Outfit", "scale_ratio": 1.25}'::jsonb,
    border_radius_tokens JSONB NOT NULL DEFAULT '{"button": "9999px", "card": "16px", "modal": "24px"}'::jsonb,
    component_styles JSONB NOT NULL DEFAULT '{"navbar_style": "glass_blur", "card_style": "subtle_border", "button_style": "royal_gold_gradient"}'::jsonb,
    animation_tokens JSONB NOT NULL DEFAULT '{"transition_duration": "0.3s", "hover_elevation": "6px"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- TABLE 2: seo_metadata
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
    twitter_card_type twitter_card_type NOT NULL DEFAULT 'summary_large_image',
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
    structured_data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    robots_directive robots_directive NOT NULL DEFAULT 'index_follow',
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    alternate_languages JSONB NOT NULL DEFAULT '{}'::jsonb,
    sitemap_priority NUMERIC(2, 1) NOT NULL DEFAULT 0.8,
    sitemap_changefreq VARCHAR(16) NOT NULL DEFAULT 'weekly',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 3: cms_pages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    page_type cms_page_type NOT NULL DEFAULT 'standard',
    status cms_publish_status NOT NULL DEFAULT 'draft',
    is_home BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NULL,
    schedule_publish_at TIMESTAMPTZ NULL,
    schedule_unpublish_at TIMESTAMPTZ NULL,
    seo_metadata_id UUID NULL REFERENCES seo_metadata(id) ON DELETE SET NULL,
    theme_id UUID NULL REFERENCES themes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_cms_pages_slug CHECK (slug ~ '^[a-z0-9/-]+$')
);

-- ----------------------------------------------------------------------------
-- TABLE 4: cms_sections
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
    section_type VARCHAR(64) NOT NULL,
    section_identifier VARCHAR(64) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    animation_config JSONB NOT NULL DEFAULT '{"type": "fade_up", "duration": 0.8, "stagger": 0.1}'::jsonb,
    content_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    theme_override JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- TABLE 5: cms_dynamic_blocks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_dynamic_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    block_type VARCHAR(64) NOT NULL,
    content JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- TABLE 6: hero_campaigns
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    campaign_type hero_campaign_type NOT NULL DEFAULT 'default',
    start_at TIMESTAMPTZ NULL,
    end_at TIMESTAMPTZ NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 0,
    layout_style hero_layout_style NOT NULL DEFAULT 'stacked_3d_cards',
    heading VARCHAR(255) NOT NULL,
    subheading TEXT,
    badge_text VARCHAR(64),
    overlay_gradient VARCHAR(64) DEFAULT 'luxury_gold_vignette',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_hero_campaigns_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ----------------------------------------------------------------------------
-- TABLE 7: hero_slides
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_campaign_id UUID NOT NULL REFERENCES hero_campaigns(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    media_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
    media_type hero_media_type NOT NULL DEFAULT 'direct_video',
    external_media_url TEXT NULL,
    poster_image_url TEXT NULL,
    title VARCHAR(128) NOT NULL,
    caption VARCHAR(255),
    badge VARCHAR(64),
    primary_cta_text VARCHAR(64),
    primary_cta_url VARCHAR(255),
    secondary_cta_text VARCHAR(64),
    secondary_cta_url VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 8: navigation_menus
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS navigation_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    location navigation_location NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_navigation_menus_tenant_location UNIQUE (tenant_id, location)
);

-- ----------------------------------------------------------------------------
-- TABLE 9: navigation_items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID NULL REFERENCES navigation_items(id) ON DELETE CASCADE,
    label VARCHAR(128) NOT NULL,
    url VARCHAR(255) NOT NULL,
    target VARCHAR(16) NOT NULL DEFAULT '_self',
    item_type navigation_item_type NOT NULL DEFAULT 'internal_page',
    page_id UUID NULL REFERENCES cms_pages(id) ON DELETE SET NULL,
    icon_name VARCHAR(32),
    highlight_badge VARCHAR(32),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_desktop_only BOOLEAN NOT NULL DEFAULT false,
    is_mobile_only BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 10: forms
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    submit_button_text VARCHAR(64) NOT NULL DEFAULT 'Submit Inquiry',
    success_message TEXT NOT NULL DEFAULT 'Thank you. Our banquet concierge will contact you shortly.',
    redirect_url TEXT NULL,
    notification_emails TEXT[] DEFAULT '{}',
    send_whatsapp_alert BOOLEAN NOT NULL DEFAULT true,
    webhook_url TEXT NULL,
    spam_protection spam_protection_type NOT NULL DEFAULT 'turnstile',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_forms_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ----------------------------------------------------------------------------
-- TABLE 11: form_fields
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    field_name VARCHAR(64) NOT NULL,
    label VARCHAR(128) NOT NULL,
    field_type form_field_type NOT NULL DEFAULT 'text',
    placeholder VARCHAR(128),
    help_text VARCHAR(255),
    default_value TEXT,
    is_required BOOLEAN NOT NULL DEFAULT false,
    validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    column_width VARCHAR(16) NOT NULL DEFAULT 'full',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_form_fields_name CHECK (field_name ~ '^[a-z0-9_]+$'),
    CONSTRAINT chk_form_fields_width CHECK (column_width IN ('full', 'half', 'third'))
);

-- ----------------------------------------------------------------------------
-- TABLE 12: form_submissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    submitted_data JSONB NOT NULL,
    submitter_ip INET,
    submitter_user_agent TEXT,
    utm_source VARCHAR(64),
    utm_medium VARCHAR(64),
    utm_campaign VARCHAR(64),
    utm_content VARCHAR(64),
    referrer_url TEXT,
    status form_submission_status NOT NULL DEFAULT 'unread',
    converted_inquiry_id UUID NULL REFERENCES inquiries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ============================================================================
-- PHASE B: FOREIGN KEYS (DEFERRED)
-- ============================================================================
-- All CMS, page builder, hero, navigation, and form foreign keys are resolved
-- in Phase A creation order without circular dependencies.

-- ============================================================================
-- PHASE C: INDEXES
-- ============================================================================

-- themes indexes
CREATE INDEX IF NOT EXISTS idx_themes_tenant_active 
ON themes (tenant_id, is_active) 
WHERE deleted_at IS NULL AND is_active = true;

-- seo_metadata indexes
CREATE INDEX IF NOT EXISTS idx_seo_metadata_tenant_id 
ON seo_metadata (tenant_id);

-- cms_pages indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_pages_tenant_slug 
ON cms_pages (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cms_pages_status 
ON cms_pages (tenant_id, status) 
WHERE deleted_at IS NULL;

-- cms_sections indexes
CREATE INDEX IF NOT EXISTS idx_cms_sections_page_order 
ON cms_sections (page_id, display_order) 
WHERE deleted_at IS NULL AND is_visible = true;

CREATE INDEX IF NOT EXISTS idx_cms_sections_tenant_id 
ON cms_sections (tenant_id) 
WHERE deleted_at IS NULL;

-- cms_dynamic_blocks indexes
CREATE INDEX IF NOT EXISTS idx_cms_dynamic_blocks_tenant 
ON cms_dynamic_blocks (tenant_id, is_active) 
WHERE deleted_at IS NULL;

-- hero_campaigns indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_campaigns_tenant_slug
ON hero_campaigns (tenant_id, LOWER(slug))
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_hero_campaigns_priority 
ON hero_campaigns (tenant_id, priority DESC) 
WHERE deleted_at IS NULL AND is_active = true;

-- hero_slides indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_campaign_order 
ON hero_slides (hero_campaign_id, display_order) 
WHERE is_active = true;

-- navigation_items indexes
CREATE INDEX IF NOT EXISTS idx_navigation_items_menu_order 
ON navigation_items (menu_id, parent_id, display_order) 
WHERE is_visible = true;

-- forms indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_forms_tenant_slug 
ON forms (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

-- form_fields indexes
CREATE INDEX IF NOT EXISTS idx_form_fields_form_order 
ON form_fields (form_id, display_order);

-- form_submissions indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_status 
ON form_submissions (form_id, status, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_form_submissions_tenant_created 
ON form_submissions (tenant_id, created_at DESC) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- PHASE D: TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_themes_updated_at ON themes;
CREATE TRIGGER trg_themes_updated_at
BEFORE UPDATE ON themes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_seo_metadata_updated_at ON seo_metadata;
CREATE TRIGGER trg_seo_metadata_updated_at
BEFORE UPDATE ON seo_metadata
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cms_pages_updated_at ON cms_pages;
CREATE TRIGGER trg_cms_pages_updated_at
BEFORE UPDATE ON cms_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cms_sections_updated_at ON cms_sections;
CREATE TRIGGER trg_cms_sections_updated_at
BEFORE UPDATE ON cms_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cms_dynamic_blocks_updated_at ON cms_dynamic_blocks;
CREATE TRIGGER trg_cms_dynamic_blocks_updated_at
BEFORE UPDATE ON cms_dynamic_blocks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_hero_campaigns_updated_at ON hero_campaigns;
CREATE TRIGGER trg_hero_campaigns_updated_at
BEFORE UPDATE ON hero_campaigns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER trg_hero_slides_updated_at
BEFORE UPDATE ON hero_slides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_navigation_menus_updated_at ON navigation_menus;
CREATE TRIGGER trg_navigation_menus_updated_at
BEFORE UPDATE ON navigation_menus
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_navigation_items_updated_at ON navigation_items;
CREATE TRIGGER trg_navigation_items_updated_at
BEFORE UPDATE ON navigation_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_forms_updated_at ON forms;
CREATE TRIGGER trg_forms_updated_at
BEFORE UPDATE ON forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_form_fields_updated_at ON form_fields;
CREATE TRIGGER trg_form_fields_updated_at
BEFORE UPDATE ON form_fields
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER trg_form_submissions_updated_at
BEFORE UPDATE ON form_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE E: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_dynamic_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE F: POLICIES
-- ============================================================================

-- 1. themes policies
DROP POLICY IF EXISTS "Public read for active tenant themes" ON themes;
CREATE POLICY "Public read for active tenant themes"
ON themes FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage themes" ON themes;
CREATE POLICY "Staff can manage themes"
ON themes FOR ALL
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

-- 2. seo_metadata policies
DROP POLICY IF EXISTS "Public read for active tenant SEO metadata" ON seo_metadata;
CREATE POLICY "Public read for active tenant SEO metadata"
ON seo_metadata FOR SELECT
TO anon, authenticated
USING (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage SEO metadata" ON seo_metadata;
CREATE POLICY "Staff can manage SEO metadata"
ON seo_metadata FOR ALL
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

-- 3. cms_pages policies
DROP POLICY IF EXISTS "Public read for published CMS pages" ON cms_pages;
CREATE POLICY "Public read for published CMS pages"
ON cms_pages FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND status = 'published' 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage CMS pages" ON cms_pages;
CREATE POLICY "Staff can manage CMS pages"
ON cms_pages FOR ALL
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

-- 4. cms_sections policies
DROP POLICY IF EXISTS "Public read for visible sections on published pages" ON cms_sections;
CREATE POLICY "Public read for visible sections on published pages"
ON cms_sections FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_visible = true 
    AND page_id IN (
        SELECT p.id 
        FROM cms_pages p 
        WHERE p.deleted_at IS NULL AND p.status = 'published'
    )
);

DROP POLICY IF EXISTS "Staff can manage CMS sections" ON cms_sections;
CREATE POLICY "Staff can manage CMS sections"
ON cms_sections FOR ALL
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

-- 5. cms_dynamic_blocks policies
DROP POLICY IF EXISTS "Public read for active dynamic blocks" ON cms_dynamic_blocks;
CREATE POLICY "Public read for active dynamic blocks"
ON cms_dynamic_blocks FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage dynamic blocks" ON cms_dynamic_blocks;
CREATE POLICY "Staff can manage dynamic blocks"
ON cms_dynamic_blocks FOR ALL
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

-- 6. hero_campaigns policies
DROP POLICY IF EXISTS "Public read for active hero campaigns" ON hero_campaigns;
CREATE POLICY "Public read for active hero campaigns"
ON hero_campaigns FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage hero campaigns" ON hero_campaigns;
CREATE POLICY "Staff can manage hero campaigns"
ON hero_campaigns FOR ALL
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

-- 7. hero_slides policies
DROP POLICY IF EXISTS "Public read for active hero slides" ON hero_slides;
CREATE POLICY "Public read for active hero slides"
ON hero_slides FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND hero_campaign_id IN (
        SELECT hc.id 
        FROM hero_campaigns hc 
        WHERE hc.deleted_at IS NULL AND hc.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can manage hero slides" ON hero_slides;
CREATE POLICY "Staff can manage hero slides"
ON hero_slides FOR ALL
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

-- 8. navigation_menus policies
DROP POLICY IF EXISTS "Public read for active navigation menus" ON navigation_menus;
CREATE POLICY "Public read for active navigation menus"
ON navigation_menus FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage navigation menus" ON navigation_menus;
CREATE POLICY "Staff can manage navigation menus"
ON navigation_menus FOR ALL
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

-- 9. navigation_items policies
DROP POLICY IF EXISTS "Public read for visible navigation items" ON navigation_items;
CREATE POLICY "Public read for visible navigation items"
ON navigation_items FOR SELECT
TO anon, authenticated
USING (
    is_visible = true 
    AND menu_id IN (
        SELECT nm.id 
        FROM navigation_menus nm 
        WHERE nm.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can manage navigation items" ON navigation_items;
CREATE POLICY "Staff can manage navigation items"
ON navigation_items FOR ALL
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

-- 10. forms policies
DROP POLICY IF EXISTS "Public read for active forms" ON forms;
CREATE POLICY "Public read for active forms"
ON forms FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage forms" ON forms;
CREATE POLICY "Staff can manage forms"
ON forms FOR ALL
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

-- 11. form_fields policies
DROP POLICY IF EXISTS "Public read for fields of active forms" ON form_fields;
CREATE POLICY "Public read for fields of active forms"
ON form_fields FOR SELECT
TO anon, authenticated
USING (
    form_id IN (
        SELECT f.id 
        FROM forms f 
        WHERE f.deleted_at IS NULL AND f.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can manage form fields" ON form_fields;
CREATE POLICY "Staff can manage form fields"
ON form_fields FOR ALL
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

-- 12. form_submissions policies
DROP POLICY IF EXISTS "Public guests can submit forms" ON form_submissions;
CREATE POLICY "Public guests can submit forms"
ON form_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (
    form_id IN (
        SELECT f.id 
        FROM forms f 
        WHERE f.deleted_at IS NULL AND f.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can view and manage form submissions" ON form_submissions;
CREATE POLICY "Staff can view and manage form submissions"
ON form_submissions FOR ALL
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
-- PHASE G: COMMENTS
-- ============================================================================

-- themes comments
COMMENT ON TABLE themes IS 'Database-driven CSS variable token sets for real-time white-label branding.';
COMMENT ON COLUMN themes.color_tokens IS 'JSON map of HSL/Hex color tokens (primary, secondary, gold accents, dark surfaces).';
COMMENT ON COLUMN themes.is_active IS 'Flag indicating active theme currently rendered on public website.';

-- seo_metadata comments
COMMENT ON TABLE seo_metadata IS 'Search engine optimization, social cards, and Schema.org structured data.';
COMMENT ON COLUMN seo_metadata.structured_data_json IS 'Schema.org JSON-LD payload (FoodEstablishment, LocalBusiness, Event).';

-- cms_pages comments
COMMENT ON TABLE cms_pages IS 'Dynamic page registry supporting scheduling and multi-page site architectures.';
COMMENT ON COLUMN cms_pages.slug IS 'Route slug (e.g. "/" for home, "/weddings", "/tasting-room").';
COMMENT ON COLUMN cms_pages.is_home IS 'Flag identifying the root homepage of the tenant domain.';

-- cms_sections comments
COMMENT ON TABLE cms_sections IS 'Composable visual layout slices (hero, culinary, reviews, form) per page.';
COMMENT ON COLUMN cms_sections.section_type IS 'Component key matching registered UI components (e.g. hero_stack, culinary_grid).';
COMMENT ON COLUMN cms_sections.content_payload IS 'JSON data payload containing text copy, badges, and layout parameters.';

-- cms_dynamic_blocks comments
COMMENT ON TABLE cms_dynamic_blocks IS 'Global reusable blocks embedded across multiple pages without duplication.';

-- hero_campaigns comments
COMMENT ON TABLE hero_campaigns IS 'Hero presentation campaigns supporting multi-slide covers and scheduling.';
COMMENT ON COLUMN hero_campaigns.priority IS 'Higher priority score overrides default hero when active.';

-- hero_slides comments
COMMENT ON TABLE hero_slides IS 'Individual media cards, 4K vertical videos, and CTAs in 3D stacked coverflow.';

-- navigation_menus comments
COMMENT ON TABLE navigation_menus IS 'Navigation containers assigned to layout zones (header, footers, mobile drawer).';

-- navigation_items comments
COMMENT ON TABLE navigation_items IS 'Hierarchical navigation items with self-referencing parent_id for dropdown menus.';

-- forms comments
COMMENT ON TABLE forms IS 'Dynamic form definitions supporting inquiries, tastings, quotes, and careers.';

-- form_fields comments
COMMENT ON TABLE form_fields IS 'Dynamic field schema, validation rules, and layout options per form.';

-- form_submissions comments
COMMENT ON TABLE form_submissions IS 'Raw JSON submission payloads with UTM campaign tracking and CRM conversion hooks.';

-- ============================================================================
-- END OF MIGRATION 0007
-- ============================================================================
