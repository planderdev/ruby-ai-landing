import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "루비AI — 글로벌 체험단 마케팅 플랫폼",
  description:
    "루비AI는 글로벌 인플루언서·체험단을 AI로 매칭하는 마케팅 플랫폼입니다. 캠페인 등록부터 선정·콘텐츠 발행까지 한 곳에서.",
  openGraph: {
    title: "루비AI — 글로벌 체험단 마케팅 플랫폼",
    description: "글로벌 인플루언서를 AI로 매칭하는 마케팅 플랫폼",
    type: "website",
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
