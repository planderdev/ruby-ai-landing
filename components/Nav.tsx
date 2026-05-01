"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const menu = [
  { label: "서비스", href: "#features" },
  { label: "작동 방식", href: "#how" },
  { label: "글로벌", href: "#global" },
  { label: "요금제", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between px-5 md:px-10 lg:px-16">
        <a href="#" className="flex items-center" aria-label="루비AI 홈">
          <Image
            src="/logo.png"
            alt="루비AI"
            width={510}
            height={160}
            priority
            className="h-7 w-auto invert dark:invert-0"
          />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {menu.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {m.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            로그인
          </a>
          <a
            href="/signup"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            무료로 시작하기
          </a>
        </div>
      </div>
    </header>
  );
}

