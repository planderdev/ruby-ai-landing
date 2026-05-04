import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/auth/",
          "/api/",
          // Login is intentionally indexable so brand searches can land users there.
          // Signup also indexable — main conversion point.
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
