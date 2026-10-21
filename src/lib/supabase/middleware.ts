import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Middleware Session Synchronizer
 * 
 * In Next.js App Router, Server Components cannot modify cookies directly.
 * Therefore, refreshing expired authentication tokens must happen at the Middleware level
 * before the request reaches Server Components or Pages.
 * 
 * This utility:
 * 1. Reads incoming cookies from the NextRequest
 * 2. Refreshes the user's session token via `supabase.auth.getUser()`
 * 3. Writes any updated cookies to both request and response objects
 * 4. Prepares the app for future route protection and Row Level Security (RLS)
 * 
 * Reads strictly from:
 * - process.env.NEXT_PUBLIC_SUPABASE_URL
 * - process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully bypass if environment variables are not yet configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT use supabase.auth.getSession() as it is not secure on the server.
  // Using getUser() validates the token against the Supabase Auth server.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export default updateSession;
