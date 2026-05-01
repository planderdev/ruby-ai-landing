import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "로그인 — 루비AI" };

export default function LoginPage() {
  return (
    <AuthShell title="다시 만나서 반가워요" subtitle="이메일과 비밀번호로 로그인하세요.">
      <Suspense fallback={<div className="h-72" />}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:text-accent-ink">
          회원가입
        </Link>
      </p>
    </AuthShell>
  );
}
