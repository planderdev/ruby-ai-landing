import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "설정 — 루비AI" };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard/settings");

  const supabase = await createClient();

  // Pull role-specific extra info
  let extra: { bio?: string | null; region_id?: string | null } = {};
  if (profile.role === "influencer") {
    const { data } = await supabase
      .from("influencers")
      .select("bio, region_id")
      .eq("profile_id", profile.id)
      .maybeSingle();
    extra = data ?? {};
  }

  const { data: regions } = await supabase
    .from("regions")
    .select("id, code, name, flag")
    .eq("active", true)
    .order("sort_order");

  return (
    <div>
      <h1 className="display text-3xl font-semibold lg:text-4xl">설정</h1>
      <p className="mt-2 text-sm text-muted-foreground">프로필 정보와 사진을 관리합니다.</p>

      <div className="mt-8">
        <SettingsForm
          profile={{
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar_url: profile.avatar_url,
          }}
          extra={extra}
          regions={regions ?? []}
        />
      </div>
    </div>
  );
}
