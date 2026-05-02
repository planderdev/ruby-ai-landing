"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import { X, Sparkles } from "lucide-react";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };
const ComingSoonContext = createContext<Ctx | null>(null);

export function useComingSoon() {
  const ctx = useContext(ComingSoonContext);
  if (!ctx) throw new Error("useComingSoon must be used within <ComingSoonProvider>");
  return ctx;
}

export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <ComingSoonContext.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-title"
          className="fixed inset-0 z-[100] flex items-center justify-center px-5 animate-fade-in"
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background p-8 shadow-2xl animate-fade-up">
            {/* pink glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgb(var(--accent) / 0.7), transparent)",
              }}
            />
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
                <Sparkles className="size-6" />
              </div>
              <h2 id="cs-title" className="display mt-6 text-2xl font-semibold lg:text-3xl">
                베타테스트 완료
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                서비스 오픈 준비중입니다.
                <br />곧 정식 오픈 소식으로 다시 만나요.
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                💌 정식 오픈 알림을 받고 싶다면{" "}
                <a
                  href="mailto:contact@plander.io"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  contact@plander.io
                </a>
                로 메일 주세요.
              </div>

              <button
                type="button"
                onClick={close}
                className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </ComingSoonContext.Provider>
  );
}

/**
 * Drop-in replacement for action buttons/CTAs that should show the
 * coming-soon modal instead of navigating. Looks like a button by default;
 * pass any className.
 */
export function ComingSoonAction({
  children,
  className,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useComingSoon();
  return (
    <button
      type={type}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * For when we want it to look like an anchor (e.g. semantic).
 * Renders <a role="button"> intercepting click.
 */
export function ComingSoonLink({
  children,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { open } = useComingSoon();
  return (
    <a
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
