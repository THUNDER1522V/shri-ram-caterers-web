import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Browser-side Supabase Client
 * 
 * Reusable across all Client Components ("use client").
 * Uses `@supabase/ssr`'s `createBrowserClient` to manage authentication cookies
 * directly in the browser document and prepare for:
 * - Realtime subscriptions
 * - Storage uploads / downloads
 * - Client-side queries with Row Level Security (RLS)
 * - Client-side Auth (sign in, sign up, session tracking)
 * 
 * Reads strictly from:
 * - process.env.NEXT_PUBLIC_SUPABASE_URL
 * - process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables missing: Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  // Singleton pattern for client-side reuse
  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return clientInstance;
}

export default createClient;
