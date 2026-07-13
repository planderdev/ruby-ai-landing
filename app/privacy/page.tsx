import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { legalContent } from "@/lib/legal/content";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

function resolveLocale(lang?: string): Locale {
  return lang && isLocale(lang) ? lang : defaultLocale;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const title = legalContent[locale].privacy.title;
  return {
    title: `${title} — 루비AI`,
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <LegalDocument doc="privacy" locale={resolveLocale(lang)} />;
}
