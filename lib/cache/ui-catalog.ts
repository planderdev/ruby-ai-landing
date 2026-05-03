import { unstable_cache } from "next/cache";
import { getStaticSupabase } from "@/lib/supabase/static";

export type UICatalog = {
  regions: { id: string; code: string; name: string; flag: string }[];
  categories: { id: string; slug: string; name: string; emoji: string | null }[];
  channels: { id: string; slug: string; name: string }[];
  promotionTypes: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    required_fields: string[];
  }[];
};

/**
 * Same data the AI catalog uses, but with a few extra fields the UI needs
 * (emoji, required_fields). Same caching window.
 */
export const fetchUICatalog = unstable_cache(
  async (): Promise<UICatalog> => {
    const supabase = getStaticSupabase();
    const [regions, categories, channels, promotionTypes] = await Promise.all([
      supabase
        .from("regions")
        .select("id, code, name, flag")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("categories")
        .select("id, slug, name, emoji")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("channel_types")
        .select("id, slug, name")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("promotion_types")
        .select("id, slug, name, description, required_fields")
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
  ["ui-catalog-v1"],
  { revalidate: 300, tags: ["catalog"] }
);
