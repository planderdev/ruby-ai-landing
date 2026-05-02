"use client";

import { useState } from "react";
import { Plus, MessagesSquare } from "lucide-react";
import { SectionLabel } from "./Features";
import { ComingSoonAction } from "./ComingSoon";

const faqs = [
  {
    q: "루비AI는 어떤 회사에 적합한가요?",
    a: "체험단·인플루언서 마케팅을 운영하는 모든 브랜드에 적합합니다. D2C 뷰티/F&B/패션 브랜드부터 글로벌 진출을 준비하는 스타트업까지, 캠페인 규모에 관계없이 사용할 수 있습니다.",
  },
  {
    q: "인플루언서는 어떻게 검증되나요?",
    a: "SNS 계정 인증, 실제 활동 이력 확인, 운영자 수동 승인의 3단계 검증을 거칩니다. 부적합 계정은 자동 필터링되며, 부정 활동 적발 시 즉시 풀에서 제외됩니다.",
  },
  {
    q: "글로벌 캠페인 시 결제 통화는 어떻게 되나요?",
    a: "광고주는 자국 통화로 결제하고, 인플루언서는 활동 국가 통화로 정산받습니다. 환율은 정산 시점 기준으로 자동 변환되며, 수수료는 BUSINESS 플랜 이상 무료입니다.",
  },
  {
    q: "무료 플랜으로도 캠페인을 운영할 수 있나요?",
    a: "네. FREE 플랜으로 1건의 캠페인을 무료로 등록하고 응모자 10명까지 열람할 수 있습니다. 캠페인 운영에 충분한 핵심 기능을 모두 사용할 수 있습니다.",
  },
  {
    q: "콘텐츠 저작권은 누구에게 있나요?",
    a: "기본적으로 인플루언서가 저작권을 보유합니다. 광고주는 캠페인 등록 시 사용 권한 범위(2차 활용·기간·매체)를 설정할 수 있으며, 양측의 동의 후 합의가 성립됩니다.",
  },
  {
    q: "정산 주기는 어떻게 되나요?",
    a: "콘텐츠 발행 확인 후 영업일 기준 7일 이내 자동 정산됩니다. ENTERPRISE 플랜은 매주 또는 격주 정산 주기를 선택할 수 있습니다.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-muted/40 py-28 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-5 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          {/* Left */}
          <div className="lg:max-w-sm">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="display mt-4 text-4xl font-semibold lg:text-5xl">자주 묻는 질문</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground lg:text-base">
              궁금한 점이 더 있으신가요? 디스코드 커뮤니티에서 루비AI 팀과 다른 마케터들에게 직접
              답을 받을 수 있습니다.
            </p>
            <ComingSoonAction className="mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-background px-6 py-3 text-left transition-colors hover:bg-accent-soft">
              <MessagesSquare className="size-5 text-accent" />
              <span className="flex flex-col">
                <span className="text-sm font-medium">5,000+ 마케터</span>
                <span className="text-xs text-muted-foreground">이미 함께하는 커뮤니티</span>
              </span>
            </ComingSoonAction>
          </div>

          {/* Right - accordion */}
          <div className="divide-y divide-border rounded-3xl border border-border bg-background">
            {faqs.map((f, i) => (
              <FAQItem key={i} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-muted/40 lg:px-8 lg:py-6"
      >
        <span className="text-sm font-medium lg:text-base">{q}</span>
        <Plus
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-45 text-accent" : ""
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground lg:px-8 lg:pb-8">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
