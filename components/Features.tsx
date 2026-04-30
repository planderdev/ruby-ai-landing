import {
  Target,
  ListChecks,
  Globe2,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "AI 매칭 엔진",
    desc: "캠페인 카테고리·예산·타겟 국가에 맞춰 가장 어울리는 인플루언서를 자동으로 추천합니다.",
    span: "lg:col-span-2",
    visual: "match",
  },
  {
    icon: ListChecks,
    title: "5단계 캠페인 빌더",
    desc: "기본정보 → 홍보유형·채널 → 일정 → 미션·키워드 → 제공내역. 평균 7분 안에 캠페인을 오픈합니다.",
    visual: "steps",
  },
  {
    icon: Globe2,
    title: "글로벌 인플루언서 풀",
    desc: "한국·일본·동남아·미주의 인스타·유튜브·틱톡·블로그 채널을 단일 풀에서 관리합니다.",
    visual: "globe",
  },
  {
    icon: CheckCircle2,
    title: "응모·선정 워크플로",
    desc: "응모자 프로필을 카드 형태로 한눈에 비교하고, 한 번의 클릭으로 선정/미선정을 처리합니다.",
    visual: "review",
  },
  {
    icon: LayoutDashboard,
    title: "역할별 대시보드",
    desc: "광고주·인플루언서·운영자가 각자의 KPI에 집중할 수 있도록 분리된 화면을 제공합니다.",
    visual: "dashboard",
  },
  {
    icon: ShieldCheck,
    title: "운영자 검수 시스템",
    desc: "가짜 계정·부적합 콘텐츠를 사전 차단하는 다단계 승인 프로세스를 갖추었습니다.",
    span: "lg:col-span-2",
    visual: "shield",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-5 md:px-10 lg:px-16">
        <SectionLabel>핵심 기능</SectionLabel>
        <h2 className="display mt-4 max-w-3xl text-4xl font-semibold lg:text-6xl">
          캠페인의 처음과 끝을,
          <br />
          <span className="text-muted-foreground">하나의 워크스페이스에서.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  span,
  visual,
}: {
  icon: typeof Target;
  title: string;
  desc: string;
  span?: string;
  visual: string;
}) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background p-7 transition-colors hover:bg-muted/50 ${span ?? ""}`}
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
        <Icon className="size-5" strokeWidth={1.8} />
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="pointer-events-none mt-7 flex flex-1 items-end">
        <FeatureVisual kind={visual} />
      </div>
    </div>
  );
}

function FeatureVisual({ kind }: { kind: string }) {
  if (kind === "match") {
    return (
      <div className="flex w-full items-center gap-2">
        {["뷰티", "패션", "F&B", "테크"].map((t, i) => (
          <span
            key={t}
            className={`rounded-full border border-border px-3 py-1 text-xs ${
              i === 0
                ? "border-accent/30 bg-accent-soft text-accent-ink"
                : "bg-background text-muted-foreground"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }
  if (kind === "steps") {
    return (
      <div className="flex w-full items-center gap-1">
        {[1, 2, 3, 4, 5].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-[10px] font-medium ${
                i < 3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 5 && <div className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "globe") {
    return (
      <div className="flex w-full flex-wrap gap-1.5">
        {["🇰🇷", "🇯🇵", "🇺🇸", "🇹🇭", "🇻🇳", "🇮🇩"].map((f) => (
          <span
            key={f}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-base"
          >
            {f}
          </span>
        ))}
      </div>
    );
  }
  if (kind === "review") {
    return (
      <div className="flex w-full gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-muted/60 p-2"
          >
            <div className="size-6 rounded-full bg-foreground/80" />
            <div className="h-1.5 flex-1 rounded-full bg-border" />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "dashboard") {
    return (
      <div className="grid w-full grid-cols-3 gap-1.5">
        <div className="col-span-2 h-12 rounded-lg bg-muted" />
        <div className="row-span-2 rounded-lg bg-accent-soft" />
        <div className="col-span-2 h-6 rounded-lg bg-muted" />
      </div>
    );
  }
  if (kind === "shield") {
    return (
      <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-foreground" />
          <div>
            <div className="text-xs font-medium">3단계 검증 통과</div>
            <div className="text-[10px] text-muted-foreground">계정 · 콘텐츠 · 약관</div>
          </div>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-medium text-accent-ink">
          승인 완료
        </span>
      </div>
    );
  }
  return null;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-ink">
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}
