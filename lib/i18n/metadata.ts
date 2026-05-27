import type { Metadata } from "next";
import { dictionaries } from "./dictionaries";
import { localePath, type Locale } from "./config";

/** hreflang alternates shared by every landing page. */
const languageAlternates = {
  "ko-KR": "/",
  en: "/en",
  "zh-CN": "/zh",
  "x-default": "/",
};

export function buildMetadata(locale: Locale): Metadata {
  const { meta } = dictionaries[locale];
  const path = localePath[locale];

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: path,
      languages: languageAlternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      siteName: meta.brand,
      locale: meta.ogLocale,
      url: path,
      images: [
        {
          url: "/og.png",
          width: 1280,
          height: 720,
          alt: meta.ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.png"],
    },
  };
}
