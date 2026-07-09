import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Service-role Supabase client — bypasses RLS. SERVER ONLY.
 *
 * Used exclusively for trusted writes that must not be reachable from the
 * browser, e.g. marking a payment as paid and upgrading the subscription
 * after the Toss Payments API has verified the charge.
 *
 * SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC prefix, so Next.js never
 * bundles it into client code. Never import this module from a client
 * component.
 */
export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. " +
        "Supabase 대시보드 → Settings → API → service_role 키를 환경변수로 등록하세요."
    );
  }
  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
