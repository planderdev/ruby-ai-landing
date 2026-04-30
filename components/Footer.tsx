import Image from "next/image";

const cols = [
  {
    title: "제품",
    links: ["기능 소개", "요금제", "글로벌 마켓", "API 문서"],
  },
  {
    title: "회사",
    links: ["루비AI 소개", "팀", "채용", "뉴스룸"],
  },
  {
    title: "리소스",
    links: ["블로그", "성공 사례", "가이드북", "도움말"],
  },
  {
    title: "법률",
    links: ["이용약관", "개인정보처리방침", "광고주 약관", "인플루언서 약관"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-360 px-5 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          <div>
            <Image
              src="/logo.png"
              alt="루비AI"
              width={510}
              height={160}
              className="h-8 w-auto invert dark:invert-0"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              글로벌 체험단을 AI로 매칭하는 마케팅 플랫폼.
              <br />
              한국에서 시작해, 12개 마켓으로.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {["X", "IG", "DC", "in"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-xs font-medium transition-colors hover:bg-muted"
                >
                  {s}
                </a>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
              🌐 한국어 (KR)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {c.title}
                </div>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© 2026 루비AI. All rights reserved.</div>
          <div>Made with care in Seoul · Tokyo · Bangkok</div>
        </div>
      </div>
    </footer>
  );
}
