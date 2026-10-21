/**
 * White-Label Hospitality CMS: Supabase Database Type Definitions
 * 
 * Provides end-to-end TypeScript definitions for Supabase clients across:
 * - 23 Relational Tables across 9 Core Modules
 * - Row Level Security (RLS) and Tenancy isolation
 * - Strictly typed Rows, Inserts, Updates, and Relationships
 * 
 * Generated for Shri Ram Caterers and scalable to all multi-tenant hospitality verticals
 * (Catering, Banquet Halls, Wedding Planners, Decorators, Restaurants).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ------------------------------------------------------------------------
      // MODULE 1: TENANCY & WHITE-LABEL CONFIGURATION
      // ------------------------------------------------------------------------
      tenants: {
        Row: {
          id: string;
          slug: string;
          legal_name: string;
          trade_name: string;
          business_type: 'caterer' | 'banquet_hall' | 'wedding_planner' | 'decorator' | 'restaurant' | string;
          status: 'active' | 'suspended' | 'trial' | 'archived' | string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          legal_name: string;
          trade_name: string;
          business_type?: 'caterer' | 'banquet_hall' | 'wedding_planner' | 'decorator' | 'restaurant' | string;
          status?: 'active' | 'suspended' | 'trial' | 'archived' | string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          legal_name?: string;
          trade_name?: string;
          business_type?: 'caterer' | 'banquet_hall' | 'wedding_planner' | 'decorator' | 'restaurant' | string;
          status?: 'active' | 'suspended' | 'trial' | 'archived' | string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };

      tenant_domains: {
        Row: {
          id: string;
          tenant_id: string;
          domain: string;
          is_primary: boolean;
          is_verified: boolean;
          ssl_status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          domain: string;
          is_primary?: boolean;
          is_verified?: boolean;
          ssl_status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          domain?: string;
          is_primary?: boolean;
          is_verified?: boolean;
          ssl_status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      tenant_settings: {
        Row: {
          id: string;
          tenant_id: string;
          tagline: string | null;
          description: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          primary_color: string;
          secondary_color: string;
          phone_formatted: string | null;
          phone_raw: string | null;
          whatsapp_raw: string | null;
          whatsapp_prefilled_message: string | null;
          email: string | null;
          catering_inquiries_email: string | null;
          address_full: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          postal_code: string | null;
          geo_lat: number | null;
          geo_lng: number | null;
          opening_hours: string | null;
          price_range: string | null;
          service_radius: string | null;
          social_links: {
            instagram?: string;
            google_reviews?: string;
            youtube?: string;
            facebook?: string;
            [key: string]: unknown;
          };
          feature_flags: {
            live_counters?: boolean;
            tasting_sessions?: boolean;
            video_coverflow?: boolean;
            [key: string]: unknown;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          tagline?: string | null;
          description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          phone_formatted?: string | null;
          phone_raw?: string | null;
          whatsapp_raw?: string | null;
          whatsapp_prefilled_message?: string | null;
          email?: string | null;
          catering_inquiries_email?: string | null;
          address_full?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          postal_code?: string | null;
          geo_lat?: number | null;
          geo_lng?: number | null;
          opening_hours?: string | null;
          price_range?: string | null;
          service_radius?: string | null;
          social_links?: Json;
          feature_flags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          tagline?: string | null;
          description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          phone_formatted?: string | null;
          phone_raw?: string | null;
          whatsapp_raw?: string | null;
          whatsapp_prefilled_message?: string | null;
          email?: string | null;
          catering_inquiries_email?: string | null;
          address_full?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          postal_code?: string | null;
          geo_lat?: number | null;
          geo_lng?: number | null;
          opening_hours?: string | null;
          price_range?: string | null;
          service_radius?: string | null;
          social_links?: Json;
          feature_flags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tenant_settings_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 2: IAM & USER PROFILES
      // ------------------------------------------------------------------------
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };

      tenant_members: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'sales_manager' | 'head_chef' | 'floor_captain' | 'viewer' | string;
          is_active: boolean;
          invited_at: string | null;
          joined_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'sales_manager' | 'head_chef' | 'floor_captain' | 'viewer' | string;
          is_active?: boolean;
          invited_at?: string | null;
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'sales_manager' | 'head_chef' | 'floor_captain' | 'viewer' | string;
          is_active?: boolean;
          invited_at?: string | null;
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tenant_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 3: CUISINES, CATALOG & LIVE FOOD THEATRES
      // ------------------------------------------------------------------------
      cuisine_regions: {
        Row: {
          id: string;
          tenant_id: string;
          slug: string;
          title: string;
          region: string;
          tagline: string | null;
          description: string | null;
          cover_image_url: string | null;
          video_url: string | null;
          dietary_badges: string[] | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          slug: string;
          title: string;
          region: string;
          tagline?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          video_url?: string | null;
          dietary_badges?: string[] | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          slug?: string;
          title?: string;
          region?: string;
          tagline?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          video_url?: string | null;
          dietary_badges?: string[] | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cuisine_regions_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      menu_items: {
        Row: {
          id: string;
          tenant_id: string;
          cuisine_region_id: string | null;
          name: string;
          course_type: 'starter' | 'main_course' | 'bread' | 'rice' | 'dessert' | 'beverage' | 'accompaniment' | string;
          description: string | null;
          is_pure_veg: boolean;
          is_jain_available: boolean;
          is_sattvic_available: boolean;
          is_signature: boolean;
          allergens: string[] | null;
          image_url: string | null;
          preparation_method: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          cuisine_region_id?: string | null;
          name: string;
          course_type?: 'starter' | 'main_course' | 'bread' | 'rice' | 'dessert' | 'beverage' | 'accompaniment' | string;
          description?: string | null;
          is_pure_veg?: boolean;
          is_jain_available?: boolean;
          is_sattvic_available?: boolean;
          is_signature?: boolean;
          allergens?: string[] | null;
          image_url?: string | null;
          preparation_method?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          cuisine_region_id?: string | null;
          name?: string;
          course_type?: 'starter' | 'main_course' | 'bread' | 'rice' | 'dessert' | 'beverage' | 'accompaniment' | string;
          description?: string | null;
          is_pure_veg?: boolean;
          is_jain_available?: boolean;
          is_sattvic_available?: boolean;
          is_signature?: boolean;
          allergens?: string[] | null;
          image_url?: string | null;
          preparation_method?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_items_cuisine_region_id_fkey";
            columns: ["cuisine_region_id"];
            referencedRelation: "cuisine_regions";
            referencedColumns: ["id"];
          }
        ];
      };

      live_counters: {
        Row: {
          id: string;
          tenant_id: string;
          slug: string;
          tag: string;
          title: string;
          badge: string | null;
          description: string | null;
          chef_note: string | null;
          video_url: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          slug: string;
          tag: string;
          title: string;
          badge?: string | null;
          description?: string | null;
          chef_note?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          slug?: string;
          tag?: string;
          title?: string;
          badge?: string | null;
          description?: string | null;
          chef_note?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "live_counters_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      live_counter_specialties: {
        Row: {
          id: string;
          live_counter_id: string;
          title: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          live_counter_id: string;
          title: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          live_counter_id?: string;
          title?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "live_counter_specialties_live_counter_id_fkey";
            columns: ["live_counter_id"];
            referencedRelation: "live_counters";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 4: SERVICES & PACKAGES
      // ------------------------------------------------------------------------
      services: {
        Row: {
          id: string;
          tenant_id: string;
          slug: string;
          tag: string;
          title: string;
          description: string | null;
          capacity_range: string | null;
          video_url: string | null;
          poster_url: string | null;
          button_text: string | null;
          button_href: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          slug: string;
          tag: string;
          title: string;
          description?: string | null;
          capacity_range?: string | null;
          video_url?: string | null;
          poster_url?: string | null;
          button_text?: string | null;
          button_href?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          slug?: string;
          tag?: string;
          title?: string;
          description?: string | null;
          capacity_range?: string | null;
          video_url?: string | null;
          poster_url?: string | null;
          button_text?: string | null;
          button_href?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      service_features: {
        Row: {
          id: string;
          service_id: string;
          feature_text: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          feature_text: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          feature_text?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_features_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };

      service_packages: {
        Row: {
          id: string;
          tenant_id: string;
          service_id: string | null;
          name: string;
          price_per_plate: number | null;
          currency: string;
          min_guests: number | null;
          max_guests: number | null;
          inclusions: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          service_id?: string | null;
          name: string;
          price_per_plate?: number | null;
          currency?: string;
          min_guests?: number | null;
          max_guests?: number | null;
          inclusions?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          service_id?: string | null;
          name?: string;
          price_per_plate?: number | null;
          currency?: string;
          min_guests?: number | null;
          max_guests?: number | null;
          inclusions?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_packages_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_packages_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 5: MEDIA ASSETS & VISUAL GALLERIES
      // ------------------------------------------------------------------------
      media_assets: {
        Row: {
          id: string;
          tenant_id: string;
          media_type: 'video' | 'image' | 'youtube' | 'instagram' | string;
          storage_path: string;
          poster_url: string | null;
          aspect_ratio: string;
          width: number | null;
          height: number | null;
          file_size_bytes: number | null;
          mime_type: string | null;
          alt_text: string | null;
          caption: string | null;
          blurhash: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          media_type?: 'video' | 'image' | 'youtube' | 'instagram' | string;
          storage_path: string;
          poster_url?: string | null;
          aspect_ratio?: string;
          width?: number | null;
          height?: number | null;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          alt_text?: string | null;
          caption?: string | null;
          blurhash?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          media_type?: 'video' | 'image' | 'youtube' | 'instagram' | string;
          storage_path?: string;
          poster_url?: string | null;
          aspect_ratio?: string;
          width?: number | null;
          height?: number | null;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          alt_text?: string | null;
          caption?: string | null;
          blurhash?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      gallery_categories: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          slug: string;
          display_order: number;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          slug: string;
          display_order?: number;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_categories_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      gallery_items: {
        Row: {
          id: string;
          tenant_id: string;
          category_id: string;
          media_asset_id: string;
          title: string;
          description: string;
          event_name: string;
          location: string;
          event_date: string;
          event_date_formatted: string | null;
          tag: string | null;
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          category_id: string;
          media_asset_id: string;
          title: string;
          description: string;
          event_name: string;
          location: string;
          event_date: string;
          event_date_formatted?: string | null;
          tag?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          category_id?: string;
          media_asset_id?: string;
          title?: string;
          description?: string;
          event_name?: string;
          location?: string;
          event_date?: string;
          event_date_formatted?: string | null;
          tag?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_items_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gallery_items_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "gallery_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gallery_items_media_asset_id_fkey";
            columns: ["media_asset_id"];
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 6: LEADS & TASTING CRM
      // ------------------------------------------------------------------------
      inquiries: {
        Row: {
          id: string;
          tenant_id: string;
          host_name: string;
          phone: string;
          email: string | null;
          event_type: string;
          event_date: string | null;
          event_date_raw: string | null;
          estimated_guests: string | null;
          guest_count_num: number | null;
          venue_city: string | null;
          venue_name: string | null;
          estimated_budget: number | null;
          source: string;
          status: 'new' | 'contacted' | 'tasting_scheduled' | 'proposal_sent' | 'confirmed' | 'lost' | string;
          assigned_to_user_id: string | null;
          notes: string | null;
          snapshot_menu_data: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          host_name: string;
          phone: string;
          email?: string | null;
          event_type: string;
          event_date?: string | null;
          event_date_raw?: string | null;
          estimated_guests?: string | null;
          guest_count_num?: number | null;
          venue_city?: string | null;
          venue_name?: string | null;
          estimated_budget?: number | null;
          source?: string;
          status?: 'new' | 'contacted' | 'tasting_scheduled' | 'proposal_sent' | 'confirmed' | 'lost' | string;
          assigned_to_user_id?: string | null;
          notes?: string | null;
          snapshot_menu_data?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          host_name?: string;
          phone?: string;
          email?: string | null;
          event_type?: string;
          event_date?: string | null;
          event_date_raw?: string | null;
          estimated_guests?: string | null;
          guest_count_num?: number | null;
          venue_city?: string | null;
          venue_name?: string | null;
          estimated_budget?: number | null;
          source?: string;
          status?: 'new' | 'contacted' | 'tasting_scheduled' | 'proposal_sent' | 'confirmed' | 'lost' | string;
          assigned_to_user_id?: string | null;
          notes?: string | null;
          snapshot_menu_data?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_assigned_to_user_id_fkey";
            columns: ["assigned_to_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      inquiry_timeline_events: {
        Row: {
          id: string;
          inquiry_id: string;
          created_by_user_id: string | null;
          event_type: string;
          title: string;
          details: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id: string;
          created_by_user_id?: string | null;
          event_type: string;
          title: string;
          details?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inquiry_id?: string;
          created_by_user_id?: string | null;
          event_type?: string;
          title?: string;
          details?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiry_timeline_events_inquiry_id_fkey";
            columns: ["inquiry_id"];
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiry_timeline_events_created_by_user_id_fkey";
            columns: ["created_by_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      tasting_sessions: {
        Row: {
          id: string;
          tenant_id: string;
          inquiry_id: string;
          scheduled_at: string;
          attendee_count: number;
          host_attendees_names: string | null;
          curated_dishes_ids: string[] | null;
          chef_in_charge_user_id: string | null;
          feedback_notes: string | null;
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          inquiry_id: string;
          scheduled_at: string;
          attendee_count?: number;
          host_attendees_names?: string | null;
          curated_dishes_ids?: string[] | null;
          chef_in_charge_user_id?: string | null;
          feedback_notes?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          inquiry_id?: string;
          scheduled_at?: string;
          attendee_count?: number;
          host_attendees_names?: string | null;
          curated_dishes_ids?: string[] | null;
          chef_in_charge_user_id?: string | null;
          feedback_notes?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasting_sessions_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasting_sessions_inquiry_id_fkey";
            columns: ["inquiry_id"];
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasting_sessions_chef_in_charge_user_id_fkey";
            columns: ["chef_in_charge_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 7: REVIEWS & SOCIAL PROOF
      // ------------------------------------------------------------------------
      reviews: {
        Row: {
          id: string;
          tenant_id: string;
          review_type: 'google' | 'video' | 'image' | string;
          author_name: string;
          author_role: string | null;
          event_type: string | null;
          location: string | null;
          rating: number;
          quote: string;
          is_verified: boolean;
          review_date: string | null;
          review_date_formatted: string | null;
          media_asset_id: string | null;
          view_count_text: string | null;
          external_review_id: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          review_type?: 'google' | 'video' | 'image' | string;
          author_name: string;
          author_role?: string | null;
          event_type?: string | null;
          location?: string | null;
          rating?: number;
          quote: string;
          is_verified?: boolean;
          review_date?: string | null;
          review_date_formatted?: string | null;
          media_asset_id?: string | null;
          view_count_text?: string | null;
          external_review_id?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          review_type?: 'google' | 'video' | 'image' | string;
          author_name?: string;
          author_role?: string | null;
          event_type?: string | null;
          location?: string | null;
          rating?: number;
          quote?: string;
          is_verified?: boolean;
          review_date?: string | null;
          review_date_formatted?: string | null;
          media_asset_id?: string | null;
          view_count_text?: string | null;
          external_review_id?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_media_asset_id_fkey";
            columns: ["media_asset_id"];
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 8: CONTENT MANAGEMENT & FAQS
      // ------------------------------------------------------------------------
      process_steps: {
        Row: {
          id: string;
          tenant_id: string;
          step_number: string;
          title: string;
          subtitle: string;
          description: string;
          highlights: string[] | null;
          icon_name: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          step_number: string;
          title: string;
          subtitle: string;
          description: string;
          highlights?: string[] | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          step_number?: string;
          title?: string;
          subtitle?: string;
          description?: string;
          highlights?: string[] | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "process_steps_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      faq_categories: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          slug: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          slug: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "faq_categories_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };

      faqs: {
        Row: {
          id: string;
          tenant_id: string;
          category_id: string | null;
          question: string;
          answer: string;
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          category_id?: string | null;
          question: string;
          answer: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          category_id?: string | null;
          question?: string;
          answer?: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "faqs_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "faqs_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "faq_categories";
            referencedColumns: ["id"];
          }
        ];
      };

      // ------------------------------------------------------------------------
      // MODULE 9: AUDITING & IMMUTABLE ACTIVITY LOGS
      // ------------------------------------------------------------------------
      audit_logs: {
        Row: {
          id: number;
          tenant_id: string;
          actor_user_id: string | null;
          actor_role: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          tenant_id: string;
          actor_user_id?: string | null;
          actor_role?: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          tenant_id?: string;
          actor_user_id?: string | null;
          actor_role?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey";
            columns: ["actor_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Relationships: unknown[];
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
    CompositeTypes: {
      [key: string]: unknown;
    };
  };
}

/**
 * Convenience utility types for table operations
 */
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
