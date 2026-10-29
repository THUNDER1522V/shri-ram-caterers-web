-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0009: Platform Core, SaaS Billing, Integrations & Governance
-- File: supabase/migrations/0009_platform_core_and_governance.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise Tier)
-- ============================================================================
--
-- PREREQUISITES:
-- - 0001_extensions.sql (uuid-ossp, pgcrypto, btree_gin, pg_trgm)
-- - 0002_enums.sql (subscription_status, billing_interval, payment_gateway,
--                   plugin_status, webhook_delivery_status, job_status,
--                   job_priority, security_severity, consent_type, login_status,
--                   cms_component_category)
-- - 0003_functions.sql (update_updated_at_column, current_tenant_id)
-- - 0004_foundation_tables.sql (tenants, users, tenant_members)
-- - 0006_media_crm_and_reviews.sql (inquiries)
-- - 0007_cms_hero_themes_forms.sql (cms_pages)
--
-- TABLES GENERATED (22 Tables - Completes the 68-Table Frozen Schema):
--  1. system_features
--  2. tenant_feature_overrides
--  3. subscription_plans
--  4. tenant_subscriptions
--  5. tenant_usage_meters
--  6. tenant_plugins
--  7. api_keys
--  8. webhook_endpoints
--  9. webhook_deliveries
-- 10. system_jobs
-- 11. content_translations
-- 12. ai_generation_logs
-- 13. auth_login_history
-- 14. security_events
-- 15. system_platform_settings
-- 16. cms_components
-- 17. legal_consents
-- 18. tenant_tax_profiles
-- 19. process_steps
-- 20. faq_categories
-- 21. faqs
-- 22. audit_logs
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
-- TABLE 1: system_features
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    is_globally_enabled BOOLEAN NOT NULL DEFAULT true,
    rollout_percentage SMALLINT NOT NULL DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    min_plan_tier VARCHAR(32) NOT NULL DEFAULT 'starter',
    is_beta BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 2: tenant_feature_overrides
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_feature_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES system_features(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tenant_feature UNIQUE (tenant_id, feature_id)
);

-- ----------------------------------------------------------------------------
-- TABLE 3: subscription_plans
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(64) NOT NULL,
    billing_interval billing_interval NOT NULL DEFAULT 'month',
    price_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    resource_quotas JSONB NOT NULL DEFAULT '{"max_storage_mb": 5000, "max_monthly_leads": 100, "max_staff_seats": 5, "custom_domain_allowed": true, "remove_branding": true}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 4: tenant_subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    payment_gateway payment_gateway NOT NULL DEFAULT 'razorpay',
    external_customer_id VARCHAR(128),
    external_subscription_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 5: tenant_usage_meters
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_usage_meters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_key VARCHAR(64) NOT NULL,
    current_value BIGINT NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    CONSTRAINT uq_tenant_usage_period UNIQUE (tenant_id, metric_key, period_start)
);

-- ----------------------------------------------------------------------------
-- TABLE 6: tenant_plugins
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plugin_key VARCHAR(64) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    credentials_encrypted JSONB NULL,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    status plugin_status NOT NULL DEFAULT 'disconnected',
    last_synced_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tenant_plugin UNIQUE (tenant_id, plugin_key)
);

-- ----------------------------------------------------------------------------
-- TABLE 7: api_keys
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    key_prefix VARCHAR(16) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    scopes TEXT[] NOT NULL DEFAULT '{"leads:read", "leads:write", "menu:read"}',
    expires_at TIMESTAMPTZ NULL,
    last_used_at TIMESTAMPTZ NULL,
    created_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 8: webhook_endpoints
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret VARCHAR(64) NOT NULL,
    subscribed_events TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 9: webhook_deliveries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_name VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    response_status_code INTEGER NULL,
    response_body TEXT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    next_retry_at TIMESTAMPTZ NULL,
    status webhook_delivery_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 10: system_jobs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_jobs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NULL REFERENCES tenants(id) ON DELETE CASCADE,
    job_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    priority job_priority NOT NULL DEFAULT 'normal',
    status job_status NOT NULL DEFAULT 'queued',
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_by VARCHAR(64) NULL,
    locked_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    error_message TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 11: content_translations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_table VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    locale_code VARCHAR(10) NOT NULL,
    field_name VARCHAR(64) NOT NULL,
    translation_text TEXT NOT NULL,
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    is_ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_content_translation UNIQUE (tenant_id, entity_table, entity_id, locale_code, field_name)
);

-- ----------------------------------------------------------------------------
-- TABLE 12: ai_generation_logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    feature_context VARCHAR(64) NOT NULL,
    model_name VARCHAR(64) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(8, 6) DEFAULT 0,
    input_payload JSONB NOT NULL,
    output_payload JSONB NOT NULL,
    user_feedback VARCHAR(16) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 13: auth_login_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_login_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NULL REFERENCES tenants(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    device_category VARCHAR(16),
    city VARCHAR(64),
    country VARCHAR(64),
    login_status login_status NOT NULL DEFAULT 'success',
    failure_reason VARCHAR(64) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 14: security_events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS security_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NULL REFERENCES tenants(id) ON DELETE CASCADE,
    severity security_severity NOT NULL DEFAULT 'info',
    event_type VARCHAR(64) NOT NULL,
    ip_address INET,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 15: system_platform_settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(64) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    is_secret BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 16: cms_components
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_key VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    category cms_component_category NOT NULL DEFAULT 'content',
    description TEXT,
    preview_image_url TEXT,
    settings_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 17: legal_consents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS legal_consents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subject_identifier VARCHAR(128) NOT NULL,
    consent_type consent_type NOT NULL DEFAULT 'terms_and_privacy',
    is_granted BOOLEAN NOT NULL DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 18: tenant_tax_profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_tax_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tax_name VARCHAR(64) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) NOT NULL,
    tax_number VARCHAR(32),
    is_inclusive BOOLEAN NOT NULL DEFAULT false,
    is_default BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 19: process_steps
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 20: faq_categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faq_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 21: faqs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID NULL REFERENCES faq_categories(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- TABLE 22: audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(32),
    action VARCHAR(32) NOT NULL,
    table_name VARCHAR(64) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PHASE B: FOREIGN KEYS (DEFERRED)
-- ============================================================================
-- All platform core and governance foreign keys are created in Phase A
-- without circular cross-table dependencies.

-- ============================================================================
-- PHASE C: INDEXES
-- ============================================================================

-- webhook_deliveries indexes
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_retry 
ON webhook_deliveries (tenant_id, status, next_retry_at);

-- system_jobs indexes
CREATE INDEX IF NOT EXISTS idx_system_jobs_queue 
ON system_jobs (status, scheduled_for, priority);

-- ai_generation_logs indexes
CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_lookup 
ON ai_generation_logs (tenant_id, feature_context, created_at DESC);

-- auth_login_history indexes
CREATE INDEX IF NOT EXISTS idx_auth_login_history_user 
ON auth_login_history (user_id, created_at DESC);

-- security_events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_tenant 
ON security_events (tenant_id, created_at DESC);

-- legal_consents indexes
CREATE INDEX IF NOT EXISTS idx_legal_consents_lookup 
ON legal_consents (tenant_id, subject_identifier, consent_type);

-- process_steps indexes
CREATE INDEX IF NOT EXISTS idx_process_steps_display 
ON process_steps (tenant_id, display_order) 
WHERE is_active = true;

-- faq_categories indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_faq_categories_slug 
ON faq_categories (tenant_id, LOWER(slug));

-- faqs indexes
CREATE INDEX IF NOT EXISTS idx_faqs_display 
ON faqs (tenant_id, is_published, display_order) 
WHERE deleted_at IS NULL AND is_published = true;

CREATE INDEX IF NOT EXISTS idx_faqs_fts 
ON faqs USING GIN (
    tenant_id extensions.uuid_ops, 
    (to_tsvector('english', coalesce(question, '') || ' ' || coalesce(answer, '')))
) 
WHERE deleted_at IS NULL;

-- audit_logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_table 
ON audit_logs (tenant_id, table_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_record 
ON audit_logs (record_id, created_at DESC);

-- ============================================================================
-- PHASE D: TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_system_features_updated_at ON system_features;
CREATE TRIGGER trg_system_features_updated_at
BEFORE UPDATE ON system_features
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tenant_feature_overrides_updated_at ON tenant_feature_overrides;
CREATE TRIGGER trg_tenant_feature_overrides_updated_at
BEFORE UPDATE ON tenant_feature_overrides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER trg_subscription_plans_updated_at
BEFORE UPDATE ON subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tenant_subscriptions_updated_at ON tenant_subscriptions;
CREATE TRIGGER trg_tenant_subscriptions_updated_at
BEFORE UPDATE ON tenant_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tenant_plugins_updated_at ON tenant_plugins;
CREATE TRIGGER trg_tenant_plugins_updated_at
BEFORE UPDATE ON tenant_plugins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_content_translations_updated_at ON content_translations;
CREATE TRIGGER trg_content_translations_updated_at
BEFORE UPDATE ON content_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_system_platform_settings_updated_at ON system_platform_settings;
CREATE TRIGGER trg_system_platform_settings_updated_at
BEFORE UPDATE ON system_platform_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tenant_tax_profiles_updated_at ON tenant_tax_profiles;
CREATE TRIGGER trg_tenant_tax_profiles_updated_at
BEFORE UPDATE ON tenant_tax_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_process_steps_updated_at ON process_steps;
CREATE TRIGGER trg_process_steps_updated_at
BEFORE UPDATE ON process_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_faqs_updated_at ON faqs;
CREATE TRIGGER trg_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE E: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE system_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_feature_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage_meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE F: POLICIES
-- ============================================================================

-- 1. system_features policies
DROP POLICY IF EXISTS "Public read for system features" ON system_features;
CREATE POLICY "Public read for system features"
ON system_features FOR SELECT
TO anon, authenticated
USING (true);

-- 2. tenant_feature_overrides policies
DROP POLICY IF EXISTS "Staff can view feature overrides for own tenant" ON tenant_feature_overrides;
CREATE POLICY "Staff can view feature overrides for own tenant"
ON tenant_feature_overrides FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 3. subscription_plans policies
DROP POLICY IF EXISTS "Public read for active subscription plans" ON subscription_plans;
CREATE POLICY "Public read for active subscription plans"
ON subscription_plans FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- 4. tenant_subscriptions policies
DROP POLICY IF EXISTS "Owners can view subscription details" ON tenant_subscriptions;
CREATE POLICY "Owners can view subscription details"
ON tenant_subscriptions FOR SELECT
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

-- 5. tenant_usage_meters policies
DROP POLICY IF EXISTS "Staff can view usage meters" ON tenant_usage_meters;
CREATE POLICY "Staff can view usage meters"
ON tenant_usage_meters FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 6. tenant_plugins policies
DROP POLICY IF EXISTS "Admins can manage tenant plugins" ON tenant_plugins;
CREATE POLICY "Admins can manage tenant plugins"
ON tenant_plugins FOR ALL
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

-- 7. api_keys policies
DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
CREATE POLICY "Admins can manage API keys"
ON api_keys FOR ALL
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

-- 8. webhook_endpoints policies
DROP POLICY IF EXISTS "Admins can manage webhook endpoints" ON webhook_endpoints;
CREATE POLICY "Admins can manage webhook endpoints"
ON webhook_endpoints FOR ALL
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

-- 9. webhook_deliveries policies
DROP POLICY IF EXISTS "Admins can view webhook deliveries" ON webhook_deliveries;
CREATE POLICY "Admins can view webhook deliveries"
ON webhook_deliveries FOR SELECT
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

-- 10. system_jobs policies
DROP POLICY IF EXISTS "Staff can view system jobs for own tenant" ON system_jobs;
CREATE POLICY "Staff can view system jobs for own tenant"
ON system_jobs FOR SELECT
TO authenticated
USING (
    tenant_id IS NULL 
    OR tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 11. content_translations policies
DROP POLICY IF EXISTS "Public read for content translations" ON content_translations;
CREATE POLICY "Public read for content translations"
ON content_translations FOR SELECT
TO anon, authenticated
USING (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage content translations" ON content_translations;
CREATE POLICY "Staff can manage content translations"
ON content_translations FOR ALL
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

-- 12. ai_generation_logs policies
DROP POLICY IF EXISTS "Staff can view AI generation logs" ON ai_generation_logs;
CREATE POLICY "Staff can view AI generation logs"
ON ai_generation_logs FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

DROP POLICY IF EXISTS "Staff can insert AI generation logs" ON ai_generation_logs;
CREATE POLICY "Staff can insert AI generation logs"
ON ai_generation_logs FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 13. auth_login_history policies
DROP POLICY IF EXISTS "Users can view own login history" ON auth_login_history;
CREATE POLICY "Users can view own login history"
ON auth_login_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 14. security_events policies
DROP POLICY IF EXISTS "Admins can view security events" ON security_events;
CREATE POLICY "Admins can view security events"
ON security_events FOR SELECT
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

-- 15. system_platform_settings policies
DROP POLICY IF EXISTS "Public read for non-secret platform settings" ON system_platform_settings;
CREATE POLICY "Public read for non-secret platform settings"
ON system_platform_settings FOR SELECT
TO anon, authenticated
USING (is_secret = false);

-- 16. cms_components policies
DROP POLICY IF EXISTS "Authenticated users can view registered components" ON cms_components;
CREATE POLICY "Authenticated users can view registered components"
ON cms_components FOR SELECT
TO authenticated
USING (is_active = true);

-- 17. legal_consents policies
DROP POLICY IF EXISTS "Public guests can record legal consent" ON legal_consents;
CREATE POLICY "Public guests can record legal consent"
ON legal_consents FOR INSERT
TO anon, authenticated
WITH CHECK (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can view legal consents" ON legal_consents;
CREATE POLICY "Staff can view legal consents"
ON legal_consents FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tm.tenant_id FROM tenant_members tm WHERE tm.user_id = auth.uid() AND tm.is_active = true
    )
);

-- 18. tenant_tax_profiles policies
DROP POLICY IF EXISTS "Public read for default tax profiles" ON tenant_tax_profiles;
CREATE POLICY "Public read for default tax profiles"
ON tenant_tax_profiles FOR SELECT
TO anon, authenticated
USING (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Admins can manage tax profiles" ON tenant_tax_profiles;
CREATE POLICY "Admins can manage tax profiles"
ON tenant_tax_profiles FOR ALL
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

-- 19. process_steps policies
DROP POLICY IF EXISTS "Public read for active process steps" ON process_steps;
CREATE POLICY "Public read for active process steps"
ON process_steps FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage process steps" ON process_steps;
CREATE POLICY "Staff can manage process steps"
ON process_steps FOR ALL
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

-- 20. faq_categories policies
DROP POLICY IF EXISTS "Public read for FAQ categories" ON faq_categories;
CREATE POLICY "Public read for FAQ categories"
ON faq_categories FOR SELECT
TO anon, authenticated
USING (
    tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage FAQ categories" ON faq_categories;
CREATE POLICY "Staff can manage FAQ categories"
ON faq_categories FOR ALL
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

-- 21. faqs policies
DROP POLICY IF EXISTS "Public read for published FAQs" ON faqs;
CREATE POLICY "Public read for published FAQs"
ON faqs FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL 
    AND is_published = true 
    AND tenant_id IN (
        SELECT id FROM tenants WHERE status = 'active' AND deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "Staff can manage FAQs" ON faqs;
CREATE POLICY "Staff can manage FAQs"
ON faqs FOR ALL
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

-- 22. audit_logs policies
DROP POLICY IF EXISTS "Staff can view audit logs for own tenant" ON audit_logs;
CREATE POLICY "Staff can view audit logs for own tenant"
ON audit_logs FOR SELECT
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
-- PHASE G: COMMENTS
-- ============================================================================

-- system_features comments
COMMENT ON TABLE system_features IS 'Master feature flag catalog supporting percentage rollouts and tier gating.';

-- tenant_feature_overrides comments
COMMENT ON TABLE tenant_feature_overrides IS 'Explicit feature flag activations and beta overrides per tenant.';

-- subscription_plans comments
COMMENT ON TABLE subscription_plans IS 'Commercial SaaS subscription tiers defining resource limits and pricing.';

-- tenant_subscriptions comments
COMMENT ON TABLE tenant_subscriptions IS 'Tenant SaaS subscription states, billing periods, and gateway customer IDs.';

-- tenant_usage_meters comments
COMMENT ON TABLE tenant_usage_meters IS 'Atomic resource usage meters tracking storage, inquiries, and staff quotas.';

-- tenant_plugins comments
COMMENT ON TABLE tenant_plugins IS 'Polymorphic third-party integration registry with encrypted credentials.';

-- api_keys comments
COMMENT ON TABLE api_keys IS 'Developer API keys storing SHA-256 hashed secrets with granular scopes.';

-- webhook_endpoints comments
COMMENT ON TABLE webhook_endpoints IS 'Outbound webhook subscriptions with cryptographic HMAC secrets.';

-- webhook_deliveries comments
COMMENT ON TABLE webhook_deliveries IS 'Delivery log and retry queue for outgoing webhook dispatches.';

-- system_jobs comments
COMMENT ON TABLE system_jobs IS 'Asynchronous background task queue supporting SKIP LOCKED dequeuing.';

-- content_translations comments
COMMENT ON TABLE content_translations IS 'Polymorphic multi-language translations (Hindi, Gujarati, Arabic) across all entities.';

-- ai_generation_logs comments
COMMENT ON TABLE ai_generation_logs IS 'AI prompt telemetry, token tracking, cost governance, and quality feedback.';

-- auth_login_history comments
COMMENT ON TABLE auth_login_history IS 'Security audit trail of user login attempts, devices, and geographic IPs.';

-- security_events comments
COMMENT ON TABLE security_events IS 'Threat monitoring log for rate-limit breaches, brute-force, and security alerts.';

-- system_platform_settings comments
COMMENT ON TABLE system_platform_settings IS 'Platform-wide singleton configuration for maintenance mode and CDN defaults.';

-- cms_components comments
COMMENT ON TABLE cms_components IS 'Design system component registry with JSON Schema validation for page sections.';

-- legal_consents comments
COMMENT ON TABLE legal_consents IS 'DPDP Act & GDPR compliance audit trail for client privacy and WhatsApp opt-ins.';

-- tenant_tax_profiles comments
COMMENT ON TABLE tenant_tax_profiles IS 'Hospitality tax profiles (GST/VAT rates) for catering proposals and invoicing.';

-- process_steps comments
COMMENT ON TABLE process_steps IS 'Brand process journey steps explaining hospitality booking workflow.';

-- faq_categories comments
COMMENT ON TABLE faq_categories IS 'Categories for grouping guest frequently asked questions.';

-- faqs comments
COMMENT ON TABLE faqs IS 'Guest frequently asked questions with accordion presentation.';

-- audit_logs comments
COMMENT ON TABLE audit_logs IS 'Immutable append-only audit trail recording record changes across the schema.';

-- ============================================================================
-- END OF MIGRATION 0009 — 68 TABLES 100% COMPLETED
-- ============================================================================
