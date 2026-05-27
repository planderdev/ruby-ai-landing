"use client";

import { useEffect } from "react";
import { htmlLangAttr, type Locale } from "@/lib/i18n";

/**
 * The root layout owns <html lang> (defaults to Korean for the app shell).
 * Landing pages only exist for the marketing site, so we correct the lang
 * attribute on the client for the localized routes.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = htmlLangAttr[locale];
  }, [locale]);
  return null;
}
