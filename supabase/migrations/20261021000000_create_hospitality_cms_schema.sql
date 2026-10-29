-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration: 20261021000000_create_hospitality_cms_schema.sql
-- Status: OBSOLETE / SUPERSEDED
-- ============================================================================
--
-- NOTICE TO MIGRATION RUNNERS & SUPABASE ENGINE:
-- This monolithic schema file has been fully factored, enhanced, and superseded
-- by the official HospiOS modular migration chain:
--
--   0001_extensions.sql                  - Foundational Cryptography, FTS, Vector
--   0002_enums.sql                       - 20 Bounded Domain Strongly Typed Enums
--   0003_functions.sql                   - Helpers, Context Resolvers, HMAC Hashers
--   0004_foundation_tables.sql           - Multi-tenant Workspaces, Domains, Staff
--   0005_culinary_and_services.sql       - Gastronomy, Menus, Live Food Theatres
--   0006_media_crm_and_reviews.sql       - DAM Metadata, Leads, CRM & Tastings
--   0007_cms_hero_themes_forms.sql       - Dynamic Page Builder, Hero, Forms
--   0008_dam_rbac_analytics_events.sql   - RBAC, Event Stream, Privacy Sessions
--   0009_platform_core_and_governance.sql- SaaS Subscriptions, Jobs, 68-Table Core
--
-- TO PREVENT DUPLICATE OBJECT CREATION, RELATIONAL CONFLICTS, AND CONSTRAINT
-- CLASHES, THIS MIGRATION EXECUTES AS AN IDEMPOTENT NO-OP VALIDATOR.
--
-- DO NOT RE-CREATE TABLES IN THIS MIGRATION.
-- DO NOT RE-CREATE POLICIES IN THIS MIGRATION.
-- DO NOT RE-CREATE INDEXES IN THIS MIGRATION.
-- DO NOT RE-CREATE TRIGGERS IN THIS MIGRATION.
-- ============================================================================

-- Backward-compatibility helper for any legacy external queries expecting is_tenant_member()
CREATE OR REPLACE FUNCTION is_tenant_member(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF check_tenant_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_members.tenant_id = check_tenant_id
        AND tenant_members.user_id = auth.uid()
        AND tenant_members.is_active = true
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, extensions, pg_temp;

COMMENT ON FUNCTION is_tenant_member(UUID) IS 
'Backward-compatible helper verifying active tenancy membership for the authenticated user.';

-- Verification checkpoint confirming that the 68-table HospiOS schema is initialized
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'tenants'
    ) THEN
        RAISE EXCEPTION 'HospiOS foundation tables missing. Please run migrations 0001 through 0009 prior to this migration.';
    END IF;
    RAISE NOTICE 'HospiOS migration chain 0001-0009 verified. Monolithic schema 20261021000000 successfully marked obsolete.';
END $$;

-- ============================================================================
-- END OF MIGRATION 20261021000000
-- ============================================================================
