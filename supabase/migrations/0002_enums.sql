-- ============================================================================
-- WHITE-LABEL HOSPITALITY OPERATING SYSTEM (HospiOS)
-- Migration 0002: Core System PostgreSQL ENUM Types
-- File: supabase/migrations/0002_enums.sql
-- Engine: PostgreSQL 15+ (Supabase Enterprise)
-- ============================================================================
--
-- PURPOSE:
-- Establishes strongly typed PostgreSQL ENUM types across all 20 bounded domains
-- of the 68-table HospiOS architecture.
--
-- CONVENTIONS:
-- - Idempotent DO $$ blocks with duplicate_object exception handling
-- - Lowercase snake_case naming conventions for types and enum values
-- - Strictly typed values preventing invalid states at the database kernel level
--
-- DO NOT CREATE TABLES IN THIS MIGRATION.
-- DO NOT CREATE TRIGGERS IN THIS MIGRATION.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TENANCY & IDENTITY DOMAINS
-- ----------------------------------------------------------------------------

-- Business category classification for white-label workspaces
DO $$ BEGIN
    CREATE TYPE tenant_business_type AS ENUM (
        'caterer',
        'banquet_hall',
        'wedding_planner',
        'event_organizer',
        'restaurant',
        'decorator',
        'luxury_brand'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Workspace lifecycle and operational status
DO $$ BEGIN
    CREATE TYPE tenant_status AS ENUM (
        'active',
        'suspended',
        'trial',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Enterprise Role-Based Access Control (RBAC) system roles
DO $$ BEGIN
    CREATE TYPE iam_role_key AS ENUM (
        'super_admin',
        'owner',
        'general_manager',
        'sales_manager',
        'executive_chef',
        'photographer',
        'content_editor',
        'operations_captain',
        'support',
        'viewer'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- User authentication and device session login status
DO $$ BEGIN
    CREATE TYPE login_status AS ENUM (
        'success',
        'failed',
        'mfa_challenge',
        'blocked'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 2. CMS & WEBSITE BUILDER DOMAINS
-- ----------------------------------------------------------------------------

-- Dynamic page layout types
DO $$ BEGIN
    CREATE TYPE cms_page_type AS ENUM (
        'standard',
        'landing',
        'campaign',
        'story',
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Editorial publishing lifecycle for pages and sections
DO $$ BEGIN
    CREATE TYPE cms_publish_status AS ENUM (
        'draft',
        'published',
        'scheduled',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Component registry classification for design system blocks
DO $$ BEGIN
    CREATE TYPE cms_component_category AS ENUM (
        'hero',
        'culinary',
        'services',
        'media',
        'interactive',
        'forms',
        'footer',
        'content'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Search engine robots indexing directives
DO $$ BEGIN
    CREATE TYPE robots_directive AS ENUM (
        'index_follow',
        'noindex_nofollow',
        'index_nofollow',
        'noindex_follow'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Twitter/X social card preview variants
DO $$ BEGIN
    CREATE TYPE twitter_card_type AS ENUM (
        'summary',
        'summary_large_image',
        'app',
        'player'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 3. HERO CMS DOMAIN
-- ----------------------------------------------------------------------------

-- Scheduled hero campaign classifications
DO $$ BEGIN
    CREATE TYPE hero_campaign_type AS ENUM (
        'default',
        'seasonal',
        'festival',
        'flash_promo'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Multi-media format support for hero coverflow slides
DO $$ BEGIN
    CREATE TYPE hero_media_type AS ENUM (
        'direct_video',
        'direct_image',
        'youtube',
        'instagram_reel'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Visual presentation styles for hero campaigns
DO $$ BEGIN
    CREATE TYPE hero_layout_style AS ENUM (
        'stacked_3d_cards',
        'cinematic_coverflow',
        'split_hero',
        'fullscreen_ambient'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 4. NAVIGATION DOMAIN
-- ----------------------------------------------------------------------------

-- Placement locations for site navigation menus
DO $$ BEGIN
    CREATE TYPE navigation_location AS ENUM (
        'header',
        'footer_1',
        'footer_2',
        'footer_bottom',
        'mobile_drawer'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Target navigation interaction types
DO $$ BEGIN
    CREATE TYPE navigation_item_type AS ENUM (
        'internal_page',
        'section_anchor',
        'external_link',
        'cta_button'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 5. THEME ENGINE DOMAIN
-- ----------------------------------------------------------------------------

-- Preset luxury theme aesthetics
DO $$ BEGIN
    CREATE TYPE theme_mode AS ENUM (
        'dark_luxury',
        'light_palace',
        'midnight_velvet',
        'emerald_royal',
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 6. MEDIA MANAGEMENT (DAM) DOMAIN
-- ----------------------------------------------------------------------------

-- Binary digital asset classifications
DO $$ BEGIN
    CREATE TYPE media_type AS ENUM (
        'image',
        'video',
        'document_pdf',
        'youtube',
        'instagram'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 7. CULINARY CATALOG & SERVICES DOMAINS
-- ----------------------------------------------------------------------------

-- Gastronomic banquet course sequencing
DO $$ BEGIN
    CREATE TYPE course_type AS ENUM (
        'starter',
        'main_course',
        'bread',
        'rice',
        'dessert',
        'beverage',
        'accompaniment'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Hospitality package pricing tiers
DO $$ BEGIN
    CREATE TYPE service_tier_type AS ENUM (
        'standard',
        'premium',
        'royal',
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 8. CRM & VIP TASTING DOMAINS
-- ----------------------------------------------------------------------------

-- Inbound sales pipeline progression states
DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM (
        'new',
        'contacted',
        'tasting_scheduled',
        'proposal_sent',
        'confirmed',
        'lost',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Attribution channels for guest inquiries
DO $$ BEGIN
    CREATE TYPE inquiry_source AS ENUM (
        'web_quick_form',
        'detailed_inquiry',
        'whatsapp_direct',
        'phone_call',
        'referral',
        'partner'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- VIP food tasting appointment statuses
DO $$ BEGIN
    CREATE TYPE tasting_session_status AS ENUM (
        'scheduled',
        'completed',
        'cancelled',
        'rescheduled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Chronological CRM interaction audit events
DO $$ BEGIN
    CREATE TYPE inquiry_timeline_event_type AS ENUM (
        'status_change',
        'call_log',
        'whatsapp_sent',
        'email_sent',
        'internal_note',
        'tasting_booked',
        'proposal_generated'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 9. REVIEWS & SOCIAL PROOF DOMAIN
-- ----------------------------------------------------------------------------

-- Testimonial source formats
DO $$ BEGIN
    CREATE TYPE review_type AS ENUM (
        'google',
        'client_video',
        'photo_quote',
        'editorial'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Moderation lifecycle for social proof and testimonials
DO $$ BEGIN
    CREATE TYPE review_status AS ENUM (
        'pending',
        'approved',
        'rejected',
        'featured'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 10. FORMS ENGINE DOMAIN
-- ----------------------------------------------------------------------------

-- Dynamic input field schema types
DO $$ BEGIN
    CREATE TYPE form_field_type AS ENUM (
        'text',
        'textarea',
        'email',
        'phone',
        'number',
        'date',
        'select',
        'multiselect',
        'radio',
        'checkbox',
        'file_upload',
        'range_slider'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Form submission processing states
DO $$ BEGIN
    CREATE TYPE form_submission_status AS ENUM (
        'unread',
        'contacted',
        'converted',
        'spam',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Anti-bot spam defense mechanisms
DO $$ BEGIN
    CREATE TYPE spam_protection_type AS ENUM (
        'turnstile',
        'recaptcha_v3',
        'honeypot',
        'none'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 11. NOTIFICATIONS & ACTIVITY DOMAINS
-- ----------------------------------------------------------------------------

-- Multi-channel communication dispatch channels
DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM (
        'in_app',
        'email',
        'whatsapp',
        'push',
        'sms'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Outbound notification delivery lifecycle
DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM (
        'queued',
        'sent',
        'delivered',
        'failed',
        'read'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Administrative collaboration event classifications
DO $$ BEGIN
    CREATE TYPE activity_category AS ENUM (
        'content',
        'crm',
        'media',
        'security',
        'settings',
        'billing',
        'system'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 12. PLATFORM CORE & BACKGROUND JOBS
-- ----------------------------------------------------------------------------

-- Asynchronous task execution states (system_jobs)
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM (
        'queued',
        'processing',
        'completed',
        'failed',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Asynchronous task scheduling priority levels
DO $$ BEGIN
    CREATE TYPE job_priority AS ENUM (
        'critical',
        'high',
        'normal',
        'low'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 13. BILLING & SUBSCRIPTION DOMAIN
-- ----------------------------------------------------------------------------

-- SaaS workspace recurring subscription states
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'trialing',
        'active',
        'past_due',
        'canceled',
        'paused',
        'unpaid'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- SaaS subscription recurrence cadence
DO $$ BEGIN
    CREATE TYPE billing_interval AS ENUM (
        'month',
        'year',
        'quarter'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Supported payment gateway processors
DO $$ BEGIN
    CREATE TYPE payment_gateway AS ENUM (
        'razorpay',
        'stripe',
        'manual_bank'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Transaction and deposit payment statuses
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',
        'succeeded',
        'failed',
        'refunded',
        'disputed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 14. SECURITY & COMPLIANCE DOMAIN
-- ----------------------------------------------------------------------------

-- Security threat alert severity levels
DO $$ BEGIN
    CREATE TYPE security_severity AS ENUM (
        'info',
        'warning',
        'critical'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- DPDP & GDPR legal consent classifications
DO $$ BEGIN
    CREATE TYPE consent_type AS ENUM (
        'whatsapp_opt_in',
        'terms_and_privacy',
        'marketing_communications'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 15. PUBLIC API & PLUGIN MARKETPLACE DOMAINS
-- ----------------------------------------------------------------------------

-- Webhook outbound delivery status
DO $$ BEGIN
    CREATE TYPE webhook_delivery_status AS ENUM (
        'pending',
        'delivered',
        'failed',
        'exhausted'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Third-party integration connection states
DO $$ BEGIN
    CREATE TYPE plugin_status AS ENUM (
        'connected',
        'disconnected',
        'error',
        'pending_setup'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- END OF MIGRATION 0002
-- ============================================================================
