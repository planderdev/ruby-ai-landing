import { ArrowRight } from "lucide-react";
import { SectionLabel } from "./Features";
import { ComingSoonAction } from "./ComingSoon";

const advertiserSteps = [
  { n: "01", title: "캠페인 등록", desc: "5단계 빌더로 평균 7분 안에 오픈" },
  { n: "02", title: "응모자 검토", desc: "AI 매칭 점수와 함께 한눈에 비교" },
  { n: "03", title: "체험단 선정", desc: "원클릭 선정 / 미선정 처리" },
  { n: "04", title: "콘텐츠 수령", desc: "발행 확인 후 자동 정산" },
];

const creatorSteps = [
  { n: "01", title: "SNS 채널 등록", desc: "인스타·유튜브·틱톡·블로그" },
  { n: "02", title: "캠페인 둘러보기", desc: "내 카테고리에 맞춰 자동 추천" },
  { n: "03", title: "응모 & 대기", desc: "선정 결과 평균 24시간 이내" },
  { n: "04", title: "콘텐츠 발행", desc: "체험 후 발행 → 포인트 적립" },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border bg-muted/40 py-28 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-5 md:px-10 lg:px-16">
        <SectionLabel>작동 방식</SectionLabel>
        <h2 className="display mt-4 max-w-3xl text-4xl font-semibold lg:text-6xl">
          광고주와 인플루언서를,
          <br />
          <span className="text-muted-foreground">정확히 한 번에 연결합니다.</span>
        </h2>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <FlowColumn
            badge="FOR BRANDS"
            title="광고주"
            desc="제품을 알리고 싶은 브랜드라면"
            steps={advertiserSteps}
            cta="광고주 데모 보기"
          />
          <FlowColumn
            badge="FOR CREATORS"
            title="인플루언서"
            desc="체험을 즐기는 크리에이터라면"
            steps={creatorSteps}
            cta="크리에이터 가이드"
            mirrored
          />
        </div>
      </div>
    </section>
  );
}

function FlowColumn({
  badge,
  title,
  desc,
  steps,
  cta,
  mirrored,
}: {
  badge: string;
  title: string;
  desc: string;
  steps: { n: string; title: string; desc: string }[];
  cta: string;
  mirrored?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border bg-background p-7 lg:p-10 ${
        mirrored ? "lg:bg-foreground lg:text-background" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.16em] ${
            mirrored
              ? "bg-background/10 text-background lg:bg-background/15"
              : "bg-accent-soft text-accent-ink"
          }`}
        >
          {badge}
        </span>
        <span
          className={`text-xs ${
            mirrored ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {desc}
        </span>
      </div>

      <h3 className="display mt-6 text-3xl font-semibold lg:text-4xl">{title}</h3>

      <div className="mt-8 space-y-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={`flex items-start gap-4 rounded-2xl px-4 py-4 ${
              mirrored
                ? "bg-background/5 lg:bg-background/[0.06]"
                : "bg-muted"
            }`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${
                mirrored
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              }`}
            >
              {s.n}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{s.title}</div>
              <div
                className={`mt-0.5 text-xs ${
                  mirrored ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                {s.desc}
              </div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight
                className={`mt-2 size-4 shrink-0 ${
                  mirrored ? "text-background/40" : "text-muted-foreground"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <ComingSoonAction
        className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          mirrored
            ? "bg-background text-foreground hover:bg-background/90"
            : "border border-border bg-background hover:bg-muted"
        }`}
      >
        {cta}
        <ArrowRight className="size-4" />
      </ComingSoonAction>
    </div>
  );
}
