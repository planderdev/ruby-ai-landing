import { SITE, getSiteUrl } from "@/lib/seo/site";

/**
 * JSON-LD structured data — helps Google understand the site and produce
 * rich results (sitelinks, knowledge panel, software card).
 *
 * Render once on the landing page. Don't include on dashboard/auth.
 */
export function StructuredData() {
  const url = getSiteUrl();

  // Organization — appears in knowledge panel + sitelinks
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.legalName,
    url,
    logo: `${url}/logo.png`,
    image: `${url}/og.png`,
    description: SITE.description,
    email: SITE.email,
    sameAs: [] as string[],
    areaServed: SITE.areaServed.map((country) => ({
      "@type": "Country",
      name: country,
    })),
  };

  // WebSite — enables sitelinks search box
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: ["Ruby AI", "루비 AI"],
    url,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: `${url}/logo.png`,
    },
  };

  // SoftwareApplication — describes the SaaS itself
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "MarketingApplication",
    operatingSystem: "Web",
    description: SITE.description,
    url,
    inLanguage: SITE.language,
    offers: [
      {
        "@type": "Offer",
        name: "FREE",
        price: "0",
        priceCurrency: "KRW",
        description: "첫 캠페인 무료, 응모자 10명까지 열람",
      },
      {
        "@type": "Offer",
        name: "BUSINESS",
        price: "1800000",
        priceCurrency: "KRW",
        description: "월 정액. 캠페인 무제한, AI 매칭 풀패키지",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1800000",
          priceCurrency: "KRW",
          billingDuration: "P1M",
          unitText: "MONTH",
        },
      },
      {
        "@type": "Offer",
        name: "ENTERPRISE",
        priceCurrency: "KRW",
        description: "전담 매니저 · API 연동 · 글로벌 멀티 브랜드",
      },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: ["광고주", "인플루언서", "마케팅 담당자"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
    </>
  );
}
