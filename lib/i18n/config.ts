/**
 * i18n config for the marketing landing page.
 * Korean is served at `/`, English at `/en`, Chinese at `/zh`.
 */
export const locales = ["ko", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

/** Public path each locale's landing page is served from. */
export const localePath: Record<Locale, string> = {
  ko: "/",
  en: "/en",
  zh: "/zh",
};

/** Value for the `<html lang>` attribute. */
export const htmlLangAttr: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  zh: "zh-CN",
};

/** Code used for hreflang alternates + og:locale. */
export const hreflangMap: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en",
  zh: "zh-CN",
};

/** Display names for the language switcher. */
export const localeNames: Record<Locale, { native: string; code: string }> = {
  ko: { native: "한국어", code: "KR" },
  en: { native: "English", code: "EN" },
  zh: { native: "中文", code: "ZH" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
