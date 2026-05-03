"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsPayload = {
  name: string;
  avatar_url: string | null;
  bio?: string | null;
  region_id?: string | null;
};

export async function updateProfile(
  payload: SettingsPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  // Update profiles.name + avatar_url
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      avatar_url: payload.avatar_url || null,
    })
    .eq("id", user.id);

  if (profileError) return { ok: false, error: `프로필 저장 실패: ${profileError.message}` };

  // If influencer, also update influencers row
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "influencer") {
    const { error: infError } = await supabase
      .from("influencers")
      .update({
        bio: payload.bio?.trim() || null,
        region_id: payload.region_id || null,
      })
      .eq("profile_id", user.id);
    if (infError) return { ok: false, error: `인플루언서 정보 저장 실패: ${infError.message}` };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
