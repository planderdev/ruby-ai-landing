import { getCurrentProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { AdvertiserOverview } from "./_views/AdvertiserOverview";
import { InfluencerOverview } from "./_views/InfluencerOverview";
import { OperatorOverview } from "./_views/OperatorOverview";
import { redirect } from "next/navigation";

export const metadata = { title: "대시보드 — 루비AI" };

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  if (profile.role === "advertiser") {
    const [{ count: campaignCount }, { count: openCount }, { data: subscription }] =
      await Promise.all([
        supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("advertiser_id", profile.id),
        supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("advertiser_id", profile.id)
          .eq("status", "open"),
        supabase
          .from("subscriptions")
          .select("status, started_at, plan_id")
          .eq("advertiser_id", profile.id)
          .maybeSingle(),
      ]);

    const planId = subscription?.plan_id;
    const { data: plan } = planId
      ? await supabase
          .from("plans")
          .select("name, tier, monthly_price")
          .eq("id", planId)
          .maybeSingle()
      : { data: null };

    return (
      <AdvertiserOverview
        name={profile.name}
        campaignCount={campaignCount ?? 0}
        openCount={openCount ?? 0}
        plan={plan}
      />
    );
  }

  if (profile.role === "influencer") {
    const [{ count: applicationCount }, { count: selectedCount }, { data: influencer }] =
      await Promise.all([
        supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("influencer_id", profile.id),
        supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("influencer_id", profile.id)
          .eq("status", "selected"),
        supabase
          .from("influencers")
          .select("total_points, region_id")
          .eq("profile_id", profile.id)
          .maybeSingle(),
      ]);

    const regionId = influencer?.region_id;
    const { data: region } = regionId
      ? await supabase.from("regions").select("flag, name").eq("id", regionId).maybeSingle()
      : { data: null };

    return (
      <InfluencerOverview
        name={profile.name}
        approved={profile.approved}
        applicationCount={applicationCount ?? 0}
        selectedCount={selectedCount ?? 0}
        totalPoints={influencer?.total_points ?? 0}
        region={region ? `${region.flag} ${region.name}` : "—"}
      />
    );
  }

  // operator
  const [{ count: pendingUsersCount }, { count: pendingCampaignsCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("approved", false),
    supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
  ]);

  return (
    <OperatorOverview
      name={profile.name}
      pendingUsersCount={pendingUsersCount ?? 0}
      pendingCampaignsCount={pendingCampaignsCount ?? 0}
    />
  );
}
