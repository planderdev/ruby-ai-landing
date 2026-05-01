"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { approveUser } from "../actions";

export function UserApprovalRow({
  profileId,
  name,
  email,
  role,
  region,
  bio,
}: {
  profileId: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  bio: string | null;
}) {
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function decide(decision: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const result = await approveUser(profileId, decision);
      if (result.ok) {
        setHidden(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (hidden) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{name}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
              {role === "advertiser" ? "광고주" : role === "influencer" ? "인플루언서" : role}
            </span>
            {region && (
              <span className="text-xs text-muted-foreground">{region}</span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{email}</div>
          {bio && <div className="mt-1 text-xs text-muted-foreground">{bio}</div>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => decide("reject")}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-xs hover:bg-muted disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
            반려
          </button>
          <button
            onClick={() => decide("approve")}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            승인
          </button>
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
