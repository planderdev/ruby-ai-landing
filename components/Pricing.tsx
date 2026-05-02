import { Check } from "lucide-react";
import { SectionLabel } from "./Features";
import { ComingSoonAction } from "./ComingSoon";

const plans = [
  {
    name: "FREE",
    price: "₩0",
    period: "첫 캠페인",
    desc: "처음 시작하는 브랜드를 위한 무료 플랜",
    features: [
      "캠페인 1건 무료 등록",
      "응모자 10명까지 열람",
      "기본 통계 대시보드",
      "이메일 지원",
    ],
    cta: "무료로 시작",
    primary: false,
  },
  {
    name: "BUSINESS",
    price: "₩290,000",
    period: "월",
    desc: "성장 단계의 브랜드를 위한 표준 플랜",
    features: [
      "캠페인 무제한 등록",
      "AI 매칭 풀패키지",
      "고급 대시보드 · 우선 노출",
      "응모자 무제한 열람",
      "전용 채팅 지원",
    ],
    cta: "데모 신청",
    primary: true,
    badge: "추천",
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "맞춤",
    desc: "글로벌 멀티 브랜드를 위한 전담 플랜",
    features: [
      "전담 매니저 배정",
      "API · SSO 연동",
      "글로벌 멀티 브랜드 운영",
      "커스텀 SLA",
      "법무·세무 컨설팅",
    ],
    cta: "상담 문의",
    primary: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-5 md:px-10 lg:px-16">
        <div className="text-center">
          <SectionLabel>요금제</SectionLabel>
          <h2 className="display mx-auto mt-4 max-w-3xl text-4xl font-semibold lg:text-6xl">
            규모에 따라,
            <br />
            <span className="text-muted-foreground">유연하게 시작하세요.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.name} {...p} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          모든 플랜은 부가세(VAT) 별도. 결제 후 7일 이내 100% 환불.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  period,
  desc,
  features,
  cta,
  primary,
  badge,
}: {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  primary?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 ${
        primary
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-background">
          {badge}
        </span>
      )}

      <div
        className={`text-xs font-medium uppercase tracking-[0.18em] ${
          primary ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {name}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="display text-4xl font-semibold lg:text-5xl">{price}</span>
        <span
          className={`text-sm ${
            primary ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          / {period}
        </span>
      </div>
      <p
        className={`mt-3 text-sm ${
          primary ? "text-background/70" : "text-muted-foreground"
        }`}
      >
        {desc}
      </p>

      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <Check
              className={`mt-0.5 size-4 shrink-0 ${
                primary ? "text-accent" : "text-accent-ink"
              }`}
              strokeWidth={2.5}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <ComingSoonAction
        className={`mt-10 w-full rounded-full px-6 py-3 text-sm font-medium transition-colors ${
          primary
            ? "bg-background text-foreground hover:bg-background/90"
            : "border border-border bg-background text-foreground hover:bg-muted"
        }`}
      >
        {cta}
      </ComingSoonAction>
    </div>
  );
}
