import { ArrowRight } from "lucide-react";
import { ComingSoonAction } from "./ComingSoon";

export function CTA() {
  return (
    <section id="cta" className="py-28 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-5 md:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-20 text-background lg:px-20 lg:py-28">
          {/* pink glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgb(236 72 153 / 0.55), transparent)",
            }}
          />
          <div
            aria-hidden
            className="bg-grid absolute inset-0 opacity-[0.07]"
          />

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-4 py-1.5 text-xs font-medium tracking-wider text-background/80 backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent" />
              지금 가입하면 첫 캠페인 무료
            </span>
            <h2 className="display mx-auto mt-6 max-w-3xl text-4xl font-semibold lg:text-6xl">
              오늘 등록하면,
              <br />
              첫 캠페인은 <span className="text-accent">무료</span>입니다.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/70">
              신용카드 등록 없이 5분 만에 시작하세요. 글로벌 인플루언서 풀이 곧바로 열립니다.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ComingSoonAction className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
                무료로 시작하기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </ComingSoonAction>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
              >
                로그인
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
