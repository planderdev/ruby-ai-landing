import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { Plus, Search } from "lucide-react";
import { CampaignCard } from "@/components/dashboard/CampaignCard";

export const metadata = { title: "캠페인 — 루비AI" };

const STATUS_OPTIONS_ADVERTISER = [
  { value: "", label: "전체" },
  { value: "draft", label: "초안" },
  { value: "pending_approval", label: "검수중" },
  { value: "open", label: "모집중" },
  { value: "closed", label: "마감" },
  { value: "completed", label: "완료" },
] as const;

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard/campaigns");

  const params = await searchParams;
  const status = params.status ?? "";
  const q = params.q ?? "";

  const supabase = await createClient();

  let query = supabase
    .from("campaigns")
    .select(
      "id, title, business_name, thumbnail_url, status, recruit_start, recruit_end, recruit_count, region_id, category_id"
    )
    .order("created_at", { ascending: false });

  if (profile.role === "advertiser") {
    query = query.eq("advertiser_id", profile.id);
    if (status) query = query.eq("status", status as "draft");
  } else if (profile.role === "influencer") {
    query = query.eq("status", "open");
  } else {
    // operator: see all
    if (status) query = query.eq("status", status as "draft");
  }

  if (q) query = query.ilike("title", `%${q}%`);

  const { data: campaigns } = await query;

  const [regionsRes, categoriesRes] = await Promise.all([
    supabase.from("regions").select("id, flag, name"),
    supabase.from("categories").select("id, emoji, name"),
  ]);
  const regionsById = new Map((regionsRes.data ?? []).map((r) => [r.id, r]));
  const categoriesById = new Map((categoriesRes.data ?? []).map((c) => [c.id, c]));

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {profile.role === "influencer" ? "캠페인 둘러보기" : "캠페인"}
          </p>
          <h1 className="display mt-2 text-3xl font-semibold lg:text-4xl">
            {profile.role === "advertiser" && "내 캠페인"}
            {profile.role === "influencer" && "지금 모집중인 캠페인"}
            {profile.role === "operator" && "전체 캠페인"}
          </h1>
        </div>

        {profile.role === "advertiser" && (
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
          >
            <Plus className="size-4" />새 캠페인
          </Link>
        )}
      </header>

      {/* Filters */}
      <form className="mt-8 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="캠페인 제목으로 검색"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        {profile.role !== "influencer" && (
          <select
            name="status"
            defaultValue={status}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
          >
            {STATUS_OPTIONS_ADVERTISER.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
        <button className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted">
          검색
        </button>
      </form>

      {/* List */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(campaigns ?? []).map((c) => {
          const region = regionsById.get(c.region_id);
          const category = categoriesById.get(c.category_id);
          return (
            <CampaignCard
              key={c.id}
              id={c.id}
              title={c.title}
              businessName={c.business_name}
              status={c.status}
              thumbnail={c.thumbnail_url}
              recruitStart={c.recruit_start}
              recruitEnd={c.recruit_end}
              recruitCount={c.recruit_count}
              regionFlag={region?.flag ?? ""}
              regionName={region?.name ?? ""}
              categoryEmoji={category?.emoji ?? ""}
              categoryName={category?.name ?? ""}
            />
          );
        })}
        {(!campaigns || campaigns.length === 0) && (
          <div className="col-span-full rounded-3xl border border-dashed border-border bg-background p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {profile.role === "advertiser"
                ? "아직 만든 캠페인이 없어요. 새 캠페인을 만들어보세요."
                : "조건에 맞는 캠페인이 없습니다."}
            </p>
            {profile.role === "advertiser" && (
              <Link
                href="/dashboard/campaigns/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
              >
                <Plus className="size-4" />새 캠페인 만들기
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
