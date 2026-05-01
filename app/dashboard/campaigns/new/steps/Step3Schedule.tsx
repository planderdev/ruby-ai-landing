"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CampaignDraft } from "../actions";
import { StepHeader, Field, TextInput, Checkbox } from "./_shared";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function Step3Schedule({
  draft,
  update,
}: {
  draft: CampaignDraft;
  update: <K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) => void;
}) {
  function addSchedule() {
    update("schedules", [
      ...draft.schedules,
      { day_of_week: 1, start_time: "10:00", end_time: "21:00" },
    ]);
  }
  function removeSchedule(idx: number) {
    update(
      "schedules",
      draft.schedules.filter((_, i) => i !== idx)
    );
  }
  function patchSchedule(idx: number, patch: Partial<CampaignDraft["schedules"][number]>) {
    update(
      "schedules",
      draft.schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  }

  return (
    <div className="space-y-6">
      <StepHeader
        title="체험 일정"
        desc="모집 기간과 체험 가능 일정을 설정합니다."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="모집 시작">
          <TextInput
            type="datetime-local"
            value={draft.recruit_start}
            onChange={(v) => update("recruit_start", v)}
            required
          />
        </Field>
        <Field label="모집 종료">
          <TextInput
            type="datetime-local"
            value={draft.recruit_end}
            onChange={(v) => update("recruit_end", v)}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="체험 시작" hint="선택">
          <TextInput
            type="datetime-local"
            value={draft.experience_start ?? ""}
            onChange={(v) => update("experience_start", v || null)}
          />
        </Field>
        <Field label="체험 종료" hint="선택">
          <TextInput
            type="datetime-local"
            value={draft.experience_end ?? ""}
            onChange={(v) => update("experience_end", v || null)}
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Checkbox
          checked={draft.same_day_reservation}
          onChange={(v) => update("same_day_reservation", v)}
          label="당일 예약 가능"
          desc="인플루언서가 당일 방문/체험을 예약할 수 있습니다."
        />
        <Checkbox
          checked={draft.always_open}
          onChange={(v) => update("always_open", v)}
          label="24시간 운영"
          desc="요일·시간 제한 없이 언제든 가능합니다."
        />
      </div>

      {!draft.always_open && (
        <Field label="가능 요일·시간" hint="여러 슬롯 추가 가능">
          <div className="space-y-2">
            {draft.schedules.map((s, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-muted/40 p-3"
              >
                <select
                  value={s.day_of_week}
                  onChange={(e) => patchSchedule(i, { day_of_week: Number(e.target.value) })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {DAY_LABELS.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d}요일
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={s.start_time}
                  onChange={(e) => patchSchedule(i, { start_time: e.target.value })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <span className="text-xs text-muted-foreground">~</span>
                <input
                  type="time"
                  value={s.end_time}
                  onChange={(e) => patchSchedule(i, { end_time: e.target.value })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSchedule(i)}
                  className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="size-4" />
              일정 슬롯 추가
            </button>
          </div>
        </Field>
      )}
    </div>
  );
}
