"use client";

import type { CampaignDraft } from "../actions";
import type { Region } from "../CampaignBuilder";
import { StepHeader, Field, TextInput, Select } from "./_shared";

export function Step1Basic({
  draft,
  regions,
  update,
}: {
  draft: CampaignDraft;
  regions: Region[];
  update: <K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <StepHeader
        title="기본 정보"
        desc="브랜드와 캠페인의 핵심 정보를 입력합니다."
      />

      <Field label="캠페인 제목" hint="인플루언서가 가장 먼저 보는 헤드라인">
        <TextInput
          value={draft.title}
          onChange={(v) => update("title", v)}
          placeholder="예: 봄 신상 라이트 세럼 체험단 모집"
          required
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="상호명·브랜드명">
          <TextInput
            value={draft.business_name}
            onChange={(v) => update("business_name", v)}
            placeholder="예: 루비뷰티 강남점"
            required
          />
        </Field>

        <Field label="활동 지역">
          <Select
            value={draft.region_id}
            onChange={(v) => update("region_id", v)}
            options={regions.map((r) => ({ value: r.id, label: `${r.flag} ${r.name}` }))}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="썸네일 URL" hint="선택 - 800x600 권장">
          <TextInput
            value={draft.thumbnail_url}
            onChange={(v) => update("thumbnail_url", v)}
            placeholder="https://..."
            type="url"
          />
        </Field>

        <Field label="담당자 연락처" hint="선택">
          <TextInput
            value={draft.contact_phone}
            onChange={(v) => update("contact_phone", v)}
            placeholder="010-0000-0000"
            type="tel"
          />
        </Field>
      </div>
    </div>
  );
}
