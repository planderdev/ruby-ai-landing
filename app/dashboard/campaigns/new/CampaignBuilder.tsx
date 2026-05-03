"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react";
import { createCampaign, type CampaignDraft } from "./actions";
import { Step1Basic } from "./steps/Step1Basic";
import { Step2Promotion } from "./steps/Step2Promotion";
import { Step3Schedule } from "./steps/Step3Schedule";
import { Step4Recruit } from "./steps/Step4Recruit";
import { Step5Offering } from "./steps/Step5Offering";

export type Region = { id: string; code: string; name: string; flag: string };
export type Category = { id: string; slug: string; name: string; emoji: string | null };
export type Channel = { id: string; slug: string; name: string };
export type PromotionType = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  required_fields: string[];
};

const STEPS = [
  { n: 1, label: "기본정보" },
  { n: 2, label: "홍보·채널" },
  { n: 3, label: "체험 일정" },
  { n: 4, label: "체험단 설정" },
  { n: 5, label: "제공내역·포인트" },
] as const;

const initialDraft = (regionId: string): CampaignDraft => ({
  title: "",
  business_name: "",
  industry_brief: "",
  thumbnail_url: "",
  contact_phone: "",
  region_id: regionId,
  promotion_type_id: "",
  category_id: "",
  channel_type_ids: [],
  missions: [],
  recruit_start: "",
  recruit_end: "",
  experience_start: null,
  experience_end: null,
  same_day_reservation: false,
  always_open: false,
  schedules: [],
  recruit_count: 1,
  keywords: [],
  offerings: [],
  point_amount: 0,
});

export function CampaignBuilder({
  regions,
  categories,
  channels,
  promotionTypes,
}: {
  regions: Region[];
  categories: Category[];
  channels: Channel[];
  promotionTypes: PromotionType[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>(() => initialDraft(regions[0]?.id ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function applyPatch(patch: Partial<CampaignDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  /** Called by Step 1 when "AI에게 전부 맡기기" finishes */
  function applySuperAndJump(patch: Partial<CampaignDraft>) {
    applyPatch(patch);
    setError(null);
    setStep(5);
  }

  function canProceed(): string | null {
    if (step === 1) {
      if (!draft.title.trim()) return "캠페인 제목을 입력해주세요.";
      if (!draft.business_name.trim()) return "상호명을 입력해주세요.";
      if (!draft.region_id) return "활동 지역을 선택해주세요.";
    }
    if (step === 2) {
      if (!draft.promotion_type_id) return "홍보유형을 선택해주세요.";
      if (!draft.category_id) return "카테고리를 선택해주세요.";
      if (draft.channel_type_ids.length === 0) return "최소 1개 채널을 선택해주세요.";
    }
    if (step === 3) {
      if (!draft.recruit_start || !draft.recruit_end) return "모집 기간을 모두 입력해주세요.";
      if (new Date(draft.recruit_start) >= new Date(draft.recruit_end))
        return "모집 종료일은 시작일 이후여야 합니다.";
    }
    if (step === 4) {
      if (draft.recruit_count < 1) return "모집 인원은 1명 이상이어야 합니다.";
    }
    return null;
  }

  function next() {
    const err = canProceed();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(5, s + 1));
  }

  function prev() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function save(submit: boolean) {
    const err = canProceed();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createCampaign(draft, submit);
      if (result.ok) {
        router.push(`/dashboard/campaigns/${result.id}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            캠페인 목록
          </Link>
          <h1 className="display mt-2 text-3xl font-semibold lg:text-4xl">새 캠페인</h1>
        </div>
      </header>

      <StepIndicator current={step} />

      <div className="mt-8 rounded-3xl border border-border bg-background p-6 lg:p-10">
        {step === 1 && (
          <Step1Basic
            draft={draft}
            regions={regions}
            update={update}
            applySuper={applySuperAndJump}
          />
        )}
        {step === 2 && (
          <Step2Promotion
            draft={draft}
            categories={categories}
            channels={channels}
            promotionTypes={promotionTypes}
            update={update}
            applyPatch={applyPatch}
          />
        )}
        {step === 3 && <Step3Schedule draft={draft} update={update} />}
        {step === 4 && (
          <Step4Recruit draft={draft} update={update} applyPatch={applyPatch} />
        )}
        {step === 5 && (
          <Step5Offering draft={draft} update={update} applyPatch={applyPatch} />
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-ink">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1 || pending}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
          이전
        </button>

        <div className="flex items-center gap-2">
          {step === 5 ? (
            <>
              <button
                type="button"
                onClick={() => save(false)}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                초안 저장
              </button>
              <button
                type="button"
                onClick={() => save(true)}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                검수 요청
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={next}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              다음
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {STEPS.map((s) => {
        const state =
          s.n < current ? "done" : s.n === current ? "active" : "pending";
        return (
          <div
            key={s.n}
            className={`flex flex-1 min-w-[140px] items-center gap-3 rounded-2xl border px-4 py-3 ${
              state === "active"
                ? "border-foreground bg-muted"
                : state === "done"
                  ? "border-border bg-background"
                  : "border-border bg-background"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                state === "active"
                  ? "bg-foreground text-background"
                  : state === "done"
                    ? "bg-accent text-background"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {state === "done" ? <Check className="size-3.5" /> : s.n}
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Step {s.n}
              </div>
              <div className="text-sm font-medium">{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
