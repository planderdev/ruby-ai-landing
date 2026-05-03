import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { fetchUICatalog } from "@/lib/cache/ui-catalog";
import { CampaignBuilder } from "./CampaignBuilder";

export const metadata = { title: "새 캠페인 — 루비AI" };

export default async function NewCampaignPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard/campaigns/new");
  if (profile.role !== "advertiser") redirect("/dashboard");

  const catalog = await fetchUICatalog();

  return (
    <CampaignBuilder
      regions={catalog.regions}
      categories={catalog.categories}
      channels={catalog.channels}
      promotionTypes={catalog.promotionTypes}
    />
  );
}
