import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { fetchUICatalog } from "@/lib/cache/ui-catalog";
import { CampaignBuilder } from "./CampaignBuilder";

export const metadata = { title: "새 캠페인 — 루비AI" };

// AI 서버 액션(특히 "AI에게 전부 맡기기")은 생성에 수십 초가 걸릴 수 있다.
// Vercel 함수 기본 타임아웃(10s)에 잘리지 않도록 여유 확보.
export const maxDuration = 60;

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
