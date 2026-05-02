import type { Metadata } from "next";
import "./globals.css";

// Resolution order:
// 1. NEXT_PUBLIC_SITE_URL — manual override (custom domain)
// 2. VERCEL_PROJECT_PRODUCTION_URL — canonical project URL (e.g. ruby-ai-landing.vercel.app),
//    stays the same across deployments. Use this so social cards reference a stable URL.
// 3. VERCEL_URL — deployment-specific URL (changes every deploy). Last resort.
// 4. localhost — dev fallback.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

const title = "루비AI — 글로벌 체험단 마케팅 플랫폼";
const description =
  "루비AI는 글로벌 인플루언서·체험단을 AI로 매칭하는 마케팅 플랫폼입니다. 캠페인 등록부터 선정·콘텐츠 발행까지 한 곳에서.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "루비AI",
    locale: "ko_KR",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 720,
        alt: "Ruby AI — 글로벌 체험단 마케팅 플랫폼",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

const themeScript = `
(function(){try{
  var s=localStorage.getItem('theme');
  var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(d)document.documentElement.classList.add('dark');
}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
