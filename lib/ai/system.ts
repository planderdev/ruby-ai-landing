import { unstable_cache } from "next/cache";
import { getStaticSupabase } from "@/lib/supabase/static";

export type CatalogMeta = {
  regions: { id: string; code: string; name: string; flag: string }[];
  categories: { id: string; slug: string; name: string }[];
  channels: { id: string; slug: string; name: string }[];
  promotionTypes: { id: string; slug: string; name: string; description: string | null }[];
};

/**
 * Catalog metadata changes very rarely (only when admin edits the seed tables).
 * Cache for 5 minutes — saves a 4-table fetch on every campaign-builder load
 * and every AI call.
 */
export const fetchCatalog = unstable_cache(
  async (): Promise<CatalogMeta> => {
    const supabase = getStaticSupabase();
    const [regions, categories, channels, promotionTypes] = await Promise.all([
      supabase
        .from("regions")
        .select("id, code, name, flag")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("categories")
        .select("id, slug, name")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("channel_types")
        .select("id, slug, name")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("promotion_types")
        .select("id, slug, name, description")
        .eq("active", true)
        .order("sort_order"),
    ]);

    return {
      regions: regions.data ?? [],
      categories: categories.data ?? [],
      channels: channels.data ?? [],
      promotionTypes: promotionTypes.data ?? [],
    };
  },
  ["catalog-meta-v1"],
  { revalidate: 300, tags: ["catalog"] }
);

/**
 * Stable system role description. Identical bytes across all calls — caches well.
 */
const SYSTEM_ROLE = `당신은 글로벌 체험단 마케팅 플랫폼 "루비AI"의 AI 마케팅 전문가입니다.

광고주들은 마케팅을 직접 할 시간·전문성이 없어서 우리 서비스를 유료로 사용합니다.
따라서 당신의 임무는 광고주가 입력한 최소한의 정보(보통은 업종 한 줄 설명)만으로
캠페인을 거의 완성된 상태까지 자동으로 작성해주는 것입니다.

작성 원칙:
1. **한국어로** 자연스럽고 매력적인 카피를 작성합니다. (특별한 요청이 없는 한)
2. 인플루언서가 매력을 느낄 수 있게 — 너무 딱딱하거나 사무적이지 않게.
3. 광고주의 업종·제품 특성을 반영해 구체적이고 차별적이게.
4. 글로벌 마켓을 의식 — 국가별 특성이 있다면 반영.
5. 거짓이나 과장은 금지. 광고주가 입력한 사실만 기반으로 작성.
6. JSON 응답은 항상 schema에 정확히 부합해야 합니다.`;

/**
 * Builds the catalog block — the available enums the AI must pick from.
 * Identical across all calls within a deploy, so caches well.
 */
function buildCatalogBlock(catalog: CatalogMeta): string {
  return `# 사용 가능한 메타데이터

다음 ID들 중에서만 선택하여 응답해야 합니다.

## 활동 가능 지역 (regions)
${catalog.regions.map((r) => `- ${r.id} : ${r.flag} ${r.name} (${r.code})`).join("\n")}

## 카테고리 (categories)
${catalog.categories.map((c) => `- ${c.id} : ${c.name} (${c.slug})`).join("\n")}

## SNS 채널 타입 (channel_types)
${catalog.channels.map((c) => `- ${c.id} : ${c.name} (${c.slug})`).join("\n")}

## 홍보 유형 (promotion_types)
${catalog.promotionTypes
  .map((p) => `- ${p.id} : ${p.name}${p.description ? ` — ${p.description}` : ""}`)
  .join("\n")}`;
}

/**
 * Returns the system messages array with prompt caching enabled.
 * The first block is the role (stable forever), the second is the catalog
 * (stable until DB metadata changes). Cache-control on the second block
 * caches the entire prefix — including tools if any are added later.
 */
export function buildSystemBlocks(catalog: CatalogMeta) {
  return [
    { type: "text" as const, text: SYSTEM_ROLE },
    {
      type: "text" as const,
      text: buildCatalogBlock(catalog),
      cache_control: { type: "ephemeral" as const },
    },
  ];
}
