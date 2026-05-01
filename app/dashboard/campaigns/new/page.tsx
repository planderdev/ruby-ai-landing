import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { CampaignBuilder } from "./CampaignBuilder";

export const metadata = { title: "새 캠페인 — 루비AI" };

export default async function NewCampaignPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard/campaigns/new");
  if (profile.role !== "advertiser") redirect("/dashboard");

  const supabase = await createClient();

  const [regions, categories, channels, promotionTypes] = await Promise.all([
    supabase.from("regions").select("id, code, name, flag").eq("active", true).order("sort_order"),
    supabase.from("categories").select("id, slug, name, emoji").eq("active", true).order("sort_order"),
    supabase.from("channel_types").select("id, slug, name").eq("active", true).order("sort_order"),
    supabase
      .from("promotion_types")
      .select("id, slug, name, description, required_fields")
      .eq("active", true)
      .order("sort_order"),
  ]);

  return (
    <CampaignBuilder
      regions={regions.data ?? []}
      categories={categories.data ?? []}
      channels={channels.data ?? []}
      promotionTypes={promotionTypes.data ?? []}
    />
  );
}
