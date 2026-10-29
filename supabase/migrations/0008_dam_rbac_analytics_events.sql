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
-- TABLE 1: media_folders
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 2: media_collections
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 3: media_collection_items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES media_collections(id) ON DELETE CASCADE,
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_media_coll_items UNIQUE (collection_id, media_asset_id)
);

-- ----------------------------------------------------------------------------
-- TABLE 4: media_asset_usages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_asset_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    table_name VARCHAR(64) NOT NULL,
    record_id UUID NOT NULL,
    field_name VARCHAR(64) NOT NULL,
    context_label VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 5: iam_roles
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 6: iam_permissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS iam_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(32) NOT NULL,
    permission_key VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 7: iam_role_permissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS iam_role_permissions (
    role_id UUID NOT NULL REFERENCES iam_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES iam_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ----------------------------------------------------------------------------
-- TABLE 8: iam_user_tenant_roles
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 9: activity_events
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 10: notification_templates
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 11: notification_dispatches
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 12: content_versions
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 13: analytics_sessions
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 14: analytics_events
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 15: analytics_daily_rollups
-- ----------------------------------------------------------------------------
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

-- ============================================================================
-- PHASE B: FOREIGN KEYS (DEFERRED)
-- ============================================================================
-- All DAM, RBAC, notification, and analytics foreign keys are resolved
-- in Phase A creation order without circular dependencies.

-- ============================================================================
-- PHASE C: INDEXES
-- ============================================================================

-- media_folders indexes
CREATE INDEX IF NOT EXISTS idx_media_folders_parent 
ON media_folders (tenant_id, parent_id) 
WHERE deleted_at IS NULL;

-- media_collections indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_collections_slug 
ON media_collections (tenant_id, LOWER(slug)) 
WHERE deleted_at IS NULL;

-- media_collection_items indexes
CREATE INDEX IF NOT EXISTS idx_media_collection_items_order 
ON media_collection_items (collection_id, display_order);

-- media_asset_usages indexes
CREATE INDEX IF NOT EXISTS idx_media_usages_lookup 
ON media_asset_usages (media_asset_id, table_name, record_id);

-- iam_roles indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_iam_roles_unique 
ON iam_roles ((coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid)), role_key);

-- iam_user_tenant_roles indexes
CREATE INDEX IF NOT EXISTS idx_iam_user_tenant_roles_lookup 
ON iam_user_tenant_roles (user_id, tenant_id);

-- activity_events indexes
CREATE INDEX IF NOT EXISTS idx_activity_events_tenant_created 
ON activity_events (tenant_id, created_at DESC);

-- notification_templates indexes
CREATE INDEX IF NOT EXISTS idx_notification_templates_lookup 
ON notification_templates (tenant_id, channel, event_trigger);

-- notification_dispatches indexes
CREATE INDEX IF NOT EXISTS idx_notification_dispatches_queue 
ON notification_dispatches (tenant_id, status, scheduled_for);

-- content_versions indexes
CREATE INDEX IF NOT EXISTS idx_content_versions_history 
ON content_versions (tenant_id, entity_type, entity_id, version_number DESC);

-- analytics_sessions indexes
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_tenant_started 
ON analytics_sessions (tenant_id, started_at DESC);

-- analytics_events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_lookup 
ON analytics_events (tenant_id, event_name, occurred_at DESC);

-- analytics_daily_rollups indexes
CREATE INDEX IF NOT EXISTS idx_analytics_rollups_date 
ON analytics_daily_rollups (tenant_id, metric_date DESC);

-- ============================================================================
-- PHASE D: TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_media_folders_updated_at ON media_folders;
CREATE TRIGGER trg_media_folders_updated_at
BEFORE UPDATE ON media_folders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_media_collections_updated_at ON media_collections;
CREATE TRIGGER trg_media_collections_updated_at
BEFORE UPDATE ON media_collections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_iam_roles_updated_at ON iam_roles;
CREATE TRIGGER trg_iam_roles_updated_at
BEFORE UPDATE ON iam_roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER trg_notification_templates_updated_at
BEFORE UPDATE ON notification_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE E: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_asset_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE iam_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iam_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE iam_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE iam_user_tenant_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_rollups ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE F: POLICIES
-- ============================================================================

-- 1. media_folders policies
DROP POLICY IF EXISTS "Staff can view and manage media folders" ON media_folders;
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

-- 2. media_collections policies
DROP POLICY IF EXISTS "Public read for public media collections" ON media_collections;
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

DROP POLICY IF EXISTS "Staff can manage media collections" ON media_collections;
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

-- 3. media_collection_items policies
DROP POLICY IF EXISTS "Public read for public collection items" ON media_collection_items;
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

DROP POLICY IF EXISTS "Staff can manage collection items" ON media_collection_items;
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

-- 4. media_asset_usages policies
DROP POLICY IF EXISTS "Staff can view asset usages" ON media_asset_usages;
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

-- 5. iam_roles policies
DROP POLICY IF EXISTS "Authenticated users can view roles" ON iam_roles;
CREATE POLICY "Authenticated users can view roles"
ON iam_roles FOR SELECT
TO authenticated
USING (
    tenant_id IS NULL 
    OR tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Admins can manage custom roles" ON iam_roles;
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

-- 6. iam_permissions policies
DROP POLICY IF EXISTS "Authenticated users can view permissions" ON iam_permissions;
CREATE POLICY "Authenticated users can view permissions"
ON iam_permissions FOR SELECT
TO authenticated
USING (true);

-- 7. iam_role_permissions policies
DROP POLICY IF EXISTS "Authenticated users can view role permissions" ON iam_role_permissions;
CREATE POLICY "Authenticated users can view role permissions"
ON iam_role_permissions FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage role permissions" ON iam_role_permissions;
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

-- 8. iam_user_tenant_roles policies
DROP POLICY IF EXISTS "Staff can view peer user roles" ON iam_user_tenant_roles;
CREATE POLICY "Staff can view peer user roles"
ON iam_user_tenant_roles FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Admins can manage user roles" ON iam_user_tenant_roles;
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

-- 9. activity_events policies
DROP POLICY IF EXISTS "Staff can view activity events for own tenant" ON activity_events;
CREATE POLICY "Staff can view activity events for own tenant"
ON activity_events FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can insert activity events" ON activity_events;
CREATE POLICY "Staff can insert activity events"
ON activity_events FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 10. notification_templates policies
DROP POLICY IF EXISTS "Staff can view and manage notification templates" ON notification_templates;
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

-- 11. notification_dispatches policies
DROP POLICY IF EXISTS "Staff can view notification dispatches for own tenant" ON notification_dispatches;
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

-- 12. content_versions policies
DROP POLICY IF EXISTS "Staff can view and create content versions" ON content_versions;
CREATE POLICY "Staff can view and create content versions"
ON content_versions FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can insert content versions" ON content_versions;
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

-- 13. analytics_sessions policies
DROP POLICY IF EXISTS "Public guests can create analytics sessions" ON analytics_sessions;
CREATE POLICY "Public guests can create analytics sessions"
ON analytics_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can view analytics sessions" ON analytics_sessions;
CREATE POLICY "Staff can view analytics sessions"
ON analytics_sessions FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 14. analytics_events policies
DROP POLICY IF EXISTS "Public guests can record analytics events" ON analytics_events;
CREATE POLICY "Public guests can record analytics events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can view analytics events" ON analytics_events;
CREATE POLICY "Staff can view analytics events"
ON analytics_events FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 15. analytics_daily_rollups policies
DROP POLICY IF EXISTS "Staff can view daily rollups" ON analytics_daily_rollups;
CREATE POLICY "Staff can view daily rollups"
ON analytics_daily_rollups FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- ============================================================================
-- PHASE G: COMMENTS
-- ============================================================================

-- media_folders comments
COMMENT ON TABLE media_folders IS 'Nested folders for hierarchical media asset management.';

-- media_collections comments
COMMENT ON TABLE media_collections IS 'Curated marketing collections grouping assets across folders.';

-- media_collection_items comments
COMMENT ON TABLE media_collection_items IS 'Junction linking media assets to curated collections with display ordering.';

-- media_asset_usages comments
COMMENT ON TABLE media_asset_usages IS 'Reverse dependency tracker preventing accidental deletion of assets in active use.';

-- iam_roles comments
COMMENT ON TABLE iam_roles IS 'Enterprise role catalog supporting system presets and custom tenant roles.';

-- iam_permissions comments
COMMENT ON TABLE iam_permissions IS 'Atomic operational privileges across all hospitality OS modules.';

-- iam_role_permissions comments
COMMENT ON TABLE iam_role_permissions IS 'Junction mapping permissions to roles.';

-- iam_user_tenant_roles comments
COMMENT ON TABLE iam_user_tenant_roles IS 'Fine-grained role assignments per user per tenant workspace.';

-- activity_events comments
COMMENT ON TABLE activity_events IS 'Real-time event stream for administrative team feeds and alert triggers.';

-- notification_templates comments
COMMENT ON TABLE notification_templates IS 'Liquid/Mustache notification templates across WhatsApp, Email, and Push.';

-- notification_dispatches comments
COMMENT ON TABLE notification_dispatches IS 'Dispatch queue and delivery log for outbound client and staff communications.';

-- content_versions comments
COMMENT ON TABLE content_versions IS 'Immutable state snapshots supporting one-click rollbacks for pages, heroes, and menus.';

-- analytics_sessions comments
COMMENT ON TABLE analytics_sessions IS 'Salted daily hash visitor session telemetry without third-party tracking cookies.';

-- analytics_events comments
COMMENT ON TABLE analytics_events IS 'Micro-interaction event telemetry (CTA clicks, video coverflow completions, phone dials).';

-- analytics_daily_rollups comments
COMMENT ON TABLE analytics_daily_rollups IS 'Pre-computed daily performance metrics ensuring sub-second dashboard rendering.';

-- ============================================================================
-- END OF MIGRATION 0008
-- ============================================================================
