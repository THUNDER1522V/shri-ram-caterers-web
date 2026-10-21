import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Server-side Supabase Client
 * 
 * Reusable across:
 * - Server Components
 * - Server Actions ("use server")
 * - Route Handlers (app/api/...)
 * 
 * Implements Next.js 15 App Router best practices where `cookies()` is an async call.
 * Uses `@supabase/ssr`'s `createServerClient` to automatically parse and forward
 * authentication cookies, allowing Supabase to enforce Row Level Security (RLS)
 * for the authenticated user or public visitor.
 * 
 * Reads strictly from:
 * - process.env.NEXT_PUBLIC_SUPABASE_URL
 * - process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables missing: Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

export default createClient;
