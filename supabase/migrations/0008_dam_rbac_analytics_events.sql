-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0008: Digital Asset DAM, Enterprise RBAC, Activity & Analytics
-- File: supabase/migrations/0008_dam_rbac_analytics_events.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto)
-- - 0002_enums.sql (activity_category, notification_channel, notification_status)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id)
-- - 0004_foundation_tables.sql (tenants, users, tenant_members)
-- - 0006_media_crm_and_reviews.sql (media_assets)
--
-- TABLES GENERATED (15 Tables):
--  1. media_folders
--  2. media_collections
--  3. media_collection_items
--  4. media_asset_usages
--  5. iam_roles
--  6. iam_permissions
--  7. iam_role_permissions
--  8. iam_user_tenant_roles
--  9. activity_events
-- 10. notification_templates
-- 11. notification_dispatches
-- 12. content_versions
-- 13. analytics_sessions
-- 14. analytics_events
-- 15. analytics_daily_rollups
--
-- STANDARDS ENFORCED:
-- - UUIDv4 Primary Keys & BigInt Identity for High-Volume Event Streams
-- - Multi-tenant Row Level Security (RLS) on all 15 tables
-- - Multi-column composite B-Tree indexes
-- - Automatic updated_at triggers
-- - Comprehensive table and column comments
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE 1: media_folders
-- ----------------------------------------------------------------------------
-- Nested directory structure for organized asset management.
CREATE TABLE IF NOT EXISTS media_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID NULL REFERENCES media_folders(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    color_icon VARCHAR(32) NOT NULL DEFAULT 'gold_folder',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_media_folders_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comments
COMMENT ON TABLE media_folders IS 'Nested folders for hierarchical media asset management.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_folders_parent 
ON media_folders (tenant_id, parent_id) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_media_folders_updated_at
BEFORE UPDATE ON media_folders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view and manage media folders"
ON media_folders FOR ALL
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

-- ----------------------------------------------------------------------------
-- TABLE 2: media_collections
-- ----------------------------------------------------------------------------
-- Curated marketing albums across folders (e.g. Diwali Kit, Wedding Highlights).
CREATE TABLE IF NOT EXISTS media_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    description TEXT,
    cover_asset_id UUID NULL REFERENCES media_assets(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_media_collections_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comments
COMMENT ON TABLE media_collections IS 'Curated marketing collections grouping assets across folders.';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_collections_slug 
ON media_collections (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

-- Trigger: updated_at
CREATE TRIGGER trg_media_collections_updated_at
BEFORE UPDATE ON media_collections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for public media collections"
ON media_collections FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_public = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can manage media collections"
ON media_collections FOR ALL
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

-- ----------------------------------------------------------------------------
-- TABLE 3: media_collection_items
-- ----------------------------------------------------------------------------
-- Many-to-many junction between collections and media assets.
CREATE TABLE IF NOT EXISTS media_collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES media_collections(id) ON DELETE CASCADE,
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_media_coll_items UNIQUE (collection_id, media_asset_id)
);

-- Comments
COMMENT ON TABLE media_collection_items IS 'Junction linking media assets to curated collections with display ordering.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_collection_items_order 
ON media_collection_items (collection_id, display_order);

-- Row Level Security
ALTER TABLE media_collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for public collection items"
ON media_collection_items FOR SELECT
TO anon, authenticated
USING (
    collection_id IN (
        SELECT mc.id 
        FROM media_collections mc 
        WHERE mc.deleted_at IS NULL AND mc.is_public = true
    )
);

CREATE POLICY "Staff can manage collection items"
ON media_collection_items FOR ALL
TO authenticated
USING (
    collection_id IN (
        SELECT mc.id 
        FROM media_collections mc 
        JOIN tenant_members tm ON tm.tenant_id = mc.tenant_id 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor', 'photographer')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 4: media_asset_usages
-- ----------------------------------------------------------------------------
-- Reverse lookup tracking where assets are embedded across the CMS.
CREATE TABLE IF NOT EXISTS media_asset_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    table_name VARCHAR(64) NOT NULL,
    record_id UUID NOT NULL,
    field_name VARCHAR(64) NOT NULL,
    context_label VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE media_asset_usages IS 'Reverse dependency tracker preventing accidental deletion of assets in active use.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_usages_lookup 
ON media_asset_usages (media_asset_id, table_name, record_id);

-- Row Level Security
ALTER TABLE media_asset_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view asset usages"
ON media_asset_usages FOR ALL
TO authenticated
USING (
    media_asset_id IN (
        SELECT ma.id 
        FROM media_assets ma 
        JOIN tenant_members tm ON tm.tenant_id = ma.tenant_id 
        WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 5: iam_roles
-- ----------------------------------------------------------------------------
-- Master role registry supporting platform defaults and custom tenant roles.
CREATE TABLE IF NOT EXISTS iam_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_key VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE iam_roles IS 'Enterprise role catalog supporting system presets and custom tenant roles.';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_iam_roles_unique 
ON iam_roles (coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid), role_key);

-- Trigger: updated_at
CREATE TRIGGER trg_iam_roles_updated_at
BEFORE UPDATE ON iam_roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE iam_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view roles"
ON iam_roles FOR SELECT
TO authenticated
USING (
    tenant_id IS NULL 
    OR tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage custom roles"
ON iam_roles FOR ALL
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
-- TABLE 6: iam_permissions
-- ----------------------------------------------------------------------------
-- Atomic operational permission keys (e.g. hero.publish, menu.price_edit).
CREATE TABLE IF NOT EXISTS iam_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(32) NOT NULL,
    permission_key VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE iam_permissions IS 'Atomic operational privileges across all hospitality OS modules.';

-- Row Level Security
ALTER TABLE iam_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view permissions"
ON iam_permissions FOR SELECT
TO authenticated
USING (true);

-- ----------------------------------------------------------------------------
-- TABLE 7: iam_role_permissions
-- ----------------------------------------------------------------------------
-- Junction mapping atomic permissions to system and custom roles.
CREATE TABLE IF NOT EXISTS iam_role_permissions (
    role_id UUID NOT NULL REFERENCES iam_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES iam_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Comments
COMMENT ON TABLE iam_role_permissions IS 'Junction mapping permissions to roles.';

-- Row Level Security
ALTER TABLE iam_role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view role permissions"
ON iam_role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage role permissions"
ON iam_role_permissions FOR ALL
TO authenticated
USING (
    role_id IN (
        SELECT r.id 
        FROM iam_roles r 
        JOIN tenant_members tm ON tm.tenant_id = r.tenant_id 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 8: iam_user_tenant_roles
-- ----------------------------------------------------------------------------
-- Assigns users to one or more roles within specific tenant workspaces.
CREATE TABLE IF NOT EXISTS iam_user_tenant_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES iam_roles(id) ON DELETE CASCADE,
    assigned_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_user_tenant_role UNIQUE (user_id, tenant_id, role_id)
);

-- Comments
COMMENT ON TABLE iam_user_tenant_roles IS 'Fine-grained role assignments per user per tenant workspace.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_iam_user_tenant_roles_lookup 
ON iam_user_tenant_roles (user_id, tenant_id);

-- Row Level Security
ALTER TABLE iam_user_tenant_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view peer user roles"
ON iam_user_tenant_roles FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage user roles"
ON iam_user_tenant_roles FOR ALL
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
-- TABLE 9: activity_events
-- ----------------------------------------------------------------------------
-- Live event bus powering administrative collaboration feeds and webhooks.
CREATE TABLE IF NOT EXISTS activity_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    event_category activity_category NOT NULL DEFAULT 'content',
    event_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE activity_events IS 'Real-time event stream for administrative team feeds and alert triggers.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_events_tenant_created 
ON activity_events (tenant_id, created_at DESC);

-- Row Level Security
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view activity events for own tenant"
ON activity_events FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

CREATE POLICY "Staff can insert activity events"
ON activity_events FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 10: notification_templates
-- ----------------------------------------------------------------------------
-- Multi-channel notification templates (In-App, Email, WhatsApp Business API).
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel notification_channel NOT NULL DEFAULT 'in_app',
    event_trigger VARCHAR(64) NOT NULL,
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    whatsapp_template_name VARCHAR(128) NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE notification_templates IS 'Liquid/Mustache notification templates across WhatsApp, Email, and Push.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_templates_lookup 
ON notification_templates (tenant_id, channel, event_trigger);

-- Trigger: updated_at
CREATE TRIGGER trg_notification_templates_updated_at
BEFORE UPDATE ON notification_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view and manage notification templates"
ON notification_templates FOR ALL
TO authenticated
USING (
    tenant_id IS NULL 
    OR tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 11: notification_dispatches
-- ----------------------------------------------------------------------------
-- Outbound notification delivery queue and status tracking.
CREATE TABLE IF NOT EXISTS notification_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    recipient_phone VARCHAR(32),
    recipient_email VARCHAR(255),
    channel notification_channel NOT NULL,
    template_id UUID NULL REFERENCES notification_templates(id) ON DELETE SET NULL,
    title VARCHAR(255),
    body TEXT NOT NULL,
    status notification_status NOT NULL DEFAULT 'queued',
    provider_message_id VARCHAR(128),
    retry_count INTEGER NOT NULL DEFAULT 0,
    failure_reason TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ NULL,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE notification_dispatches IS 'Dispatch queue and delivery log for outbound client and staff communications.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_dispatches_queue 
ON notification_dispatches (tenant_id, status, scheduled_for);

-- Row Level Security
ALTER TABLE notification_dispatches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view notification dispatches for own tenant"
ON notification_dispatches FOR ALL
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

-- ----------------------------------------------------------------------------
-- TABLE 12: content_versions
-- ----------------------------------------------------------------------------
-- Immutable point-in-time state snapshots enabling one-click content rollbacks.
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    author_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    change_summary VARCHAR(255),
    snapshot_state JSONB NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE content_versions IS 'Immutable state snapshots supporting one-click rollbacks for pages, heroes, and menus.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_versions_history 
ON content_versions (tenant_id, entity_type, entity_id, version_number DESC);

-- Row Level Security
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view and create content versions"
ON content_versions FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

CREATE POLICY "Staff can insert content versions"
ON content_versions FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tm.tenant_id 
        FROM tenant_members tm 
        WHERE tm.user_id = auth.uid() 
          AND tm.role IN ('owner', 'general_manager', 'content_editor')
          AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 13: analytics_sessions
-- ----------------------------------------------------------------------------
-- Cookie-less, privacy-preserving visitor session tracking.
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_hash VARCHAR(64) NOT NULL,
    landing_page TEXT NOT NULL,
    referrer_domain VARCHAR(128),
    utm_source VARCHAR(64),
    utm_medium VARCHAR(64),
    utm_campaign VARCHAR(64),
    utm_content VARCHAR(64),
    device_category VARCHAR(16),
    browser_name VARCHAR(32),
    os_name VARCHAR(32),
    country_code VARCHAR(8),
    city VARCHAR(64),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE analytics_sessions IS 'Salted daily hash visitor session telemetry without third-party tracking cookies.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_tenant_started 
ON analytics_sessions (tenant_id, started_at DESC);

-- Row Level Security
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public guests can create analytics sessions"
ON analytics_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can view analytics sessions"
ON analytics_sessions FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 14: analytics_events
-- ----------------------------------------------------------------------------
-- High-precision micro-interaction tracking (CTA clicks, video plays, dials).
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
    event_name VARCHAR(64) NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    target_element_id VARCHAR(64),
    event_metadata JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE analytics_events IS 'Micro-interaction event telemetry (CTA clicks, video coverflow completions, phone dials).';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_lookup 
ON analytics_events (tenant_id, event_name, occurred_at DESC);

-- Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public guests can record analytics events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

CREATE POLICY "Staff can view analytics events"
ON analytics_events FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ----------------------------------------------------------------------------
-- TABLE 15: analytics_daily_rollups
-- ----------------------------------------------------------------------------
-- Pre-computed daily summary metrics for instant dashboard queries.
CREATE TABLE IF NOT EXISTS analytics_daily_rollups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    total_views INTEGER NOT NULL DEFAULT 0,
    unique_sessions INTEGER NOT NULL DEFAULT 0,
    total_cta_clicks INTEGER NOT NULL DEFAULT 0,
    total_inquiries INTEGER NOT NULL DEFAULT 0,
    total_whatsapp_clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_daily_rollups UNIQUE (tenant_id, metric_date, page_path)
);

-- Comments
COMMENT ON TABLE analytics_daily_rollups IS 'Pre-computed daily performance metrics ensuring sub-second dashboard rendering.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_rollups_date 
ON analytics_daily_rollups (tenant_id, metric_date DESC);

-- Row Level Security
ALTER TABLE analytics_daily_rollups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view daily rollups"
ON analytics_daily_rollups FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ============================================================================
-- END OF MIGRATION 0008
-- ============================================================================
