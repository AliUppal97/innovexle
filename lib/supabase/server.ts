import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type SupabaseServerClient = SupabaseClient<Database>;

/**
 * Supabase server client with service role key.
 * Use ONLY in server-side code (API routes, Server Components, server actions).
 * Bypasses RLS - ensure you enforce auth in your application logic.
 */
function createSupabaseServerClient(): SupabaseServerClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Singleton server client - reuse across requests in same server context */
let serverClient: SupabaseServerClient | null = null;

export function getSupabaseServerClient(): SupabaseServerClient {
  if (!serverClient) {
    serverClient = createSupabaseServerClient();
  }
  return serverClient;
}

/**
 * Check if Supabase is configured (for feature flags / fallbacks).
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}
