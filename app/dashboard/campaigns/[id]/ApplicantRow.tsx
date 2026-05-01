"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { selectApplicant } from "./actions";

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: "대기", tone: "bg-muted text-foreground" },
  selected: { label: "선정", tone: "bg-accent-soft text-accent-ink" },
  rejected: { label: "미선정", tone: "bg-muted text-muted-foreground" },
  cancelled: { label: "취소됨", tone: "bg-muted text-muted-foreground" },
  completed: { label: "완료", tone: "bg-foreground text-background" },
};

export function ApplicantRow({
  applicationId,
  campaignId,
  status,
  message,
  createdAt,
  name,
  region,
  points,
  channels,
}: {
  applicationId: string;
  campaignId: string;
  status: string;
  message: string | null;
  createdAt: string;
  name: string;
  region: string;
  points: number;
  channels: { handle: string; followers: number }[];
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function decide(decision: "selected" | "rejected") {
    setError(null);
    startTransition(async () => {
      const result = await selectApplicant(campaignId, applicationId, decision);
      if (result.ok) {
        setCurrentStatus(decision);
      } else {
        setError(result.error);
      }
    });
  }

  const info = STATUS_LABEL[currentStatus] ?? STATUS_LABEL.pending;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">{region}</span>
            <span className="text-xs text-muted-foreground">· {points.toLocaleString()}P</span>
          </div>
          {channels.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {channels.map((c, i) => (
                <span key={i}>
                  {c.handle} ({c.followers.toLocaleString()})
                </span>
              ))}
            </div>
          )}
          {message && (
            <div className="mt-2 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              {message}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${info.tone}`}>
            {info.label}
          </span>
          {currentStatus === "pending" && (
            <div className="flex gap-1">
              <button
                onClick={() => decide("rejected")}
                disabled={pending}
                className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background hover:bg-muted disabled:opacity-50"
                title="미선정"
              >
                {pending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
              </button>
              <button
                onClick={() => decide("selected")}
                disabled={pending}
                className="inline-flex size-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                title="선정"
              >
                {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2 text-xs text-accent-ink">
          {error}
        </div>
      )}
    </div>
  );
}
