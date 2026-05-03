import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Cookieless Supabase client for static/cacheable reads.
 *
 * The cookie-bound `createClient` (lib/supabase/server.ts) cannot be used
 * inside `unstable_cache` — Next.js forbids reading request-bound APIs
 * (cookies, headers) from a deterministic cache. This client uses only the
 * URL + anon key, no per-request state, so it's safe inside cached fetchers.
 *
 * Use it ONLY for public data (catalog/metadata) where RLS would allow
 * anonymous SELECT. Never use it for user-scoped queries.
 */
let _client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function getStaticSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      throw new Error("Supabase env vars are not configured.");
    }
    _client = createSupabaseClient<Database>(url, anon, {
      auth: { persistSession: false },
    });
  }
  return _client;
}
