"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function applyToCampaign(
  campaignId: string,
  message: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await supabase.from("applications").insert({
    campaign_id: campaignId,
    influencer_id: user.id,
    message: message.trim() || null,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "이미 응모하셨습니다." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  return { ok: true };
}

export async function cancelApplication(
  campaignId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("applications")
    .update({ status: "cancelled" })
    .eq("campaign_id", campaignId)
    .eq("influencer_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  return { ok: true };
}

export async function selectApplicant(
  campaignId: string,
  applicationId: string,
  decision: "selected" | "rejected"
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("applications")
    .update({
      status: decision,
      selected_at: new Date().toISOString(),
      selected_by: user.id,
    })
    .eq("id", applicationId)
    .eq("campaign_id", campaignId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  return { ok: true };
}
