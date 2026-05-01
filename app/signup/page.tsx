import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "./SignupForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "회원가입 — 루비AI" };

export default async function SignupPage() {
  const supabase = await createClient();

  const [{ data: regions }, { data: channelTypes }] = await Promise.all([
    supabase.from("regions").select("id, code, name, flag").eq("active", true).order("sort_order"),
    supabase
      .from("channel_types")
      .select("id, slug, name")
      .eq("active", true)
      .order("sort_order"),
  ]);

  return (
    <AuthShell title="루비AI에 합류하세요" subtitle="역할을 선택하고 30초 안에 가입을 마쳐요.">
      <SignupForm regions={regions ?? []} channelTypes={channelTypes ?? []} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-foreground hover:text-accent-ink">
          로그인
        </Link>
      </p>
    </AuthShell>
  );
}
