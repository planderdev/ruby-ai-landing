import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { UserApprovalRow } from "./UserApprovalRow";

export const metadata = { title: "회원 승인 — 루비AI" };

export default async function OperatorUsersPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "operator") redirect("/dashboard");

  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("profiles")
    .select("id, name, email, role, created_at")
    .eq("approved", false)
    .order("created_at", { ascending: false });

  const ids = (pending ?? []).map((p) => p.id);
  const { data: influencers } =
    ids.length > 0
      ? await supabase
          .from("influencers")
          .select("profile_id, region_id, bio")
          .in("profile_id", ids)
      : { data: [] };
  const infById = new Map((influencers ?? []).map((i) => [i.profile_id, i]));

  const regionIds = [
    ...new Set((influencers ?? []).map((i) => i.region_id).filter(Boolean) as string[]),
  ];
  const { data: regions } =
    regionIds.length > 0
      ? await supabase.from("regions").select("id, flag, name").in("id", regionIds)
      : { data: [] };
  const regionById = new Map((regions ?? []).map((r) => [r.id, r]));

  return (
    <div>
      <h1 className="display text-3xl font-semibold lg:text-4xl">회원 승인 대기</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        가입 후 승인을 기다리는 인플루언서/광고주 계정입니다.
      </p>

      <div className="mt-8 space-y-2">
        {(pending ?? []).map((p) => {
          const inf = infById.get(p.id);
          const region = inf?.region_id ? regionById.get(inf.region_id) : null;
          return (
            <UserApprovalRow
              key={p.id}
              profileId={p.id}
              name={p.name}
              email={p.email}
              role={p.role}
              region={region ? `${region.flag} ${region.name}` : undefined}
              bio={inf?.bio ?? null}
            />
          );
        })}
        {(!pending || pending.length === 0) && (
          <div className="rounded-3xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
            승인 대기중인 회원이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
