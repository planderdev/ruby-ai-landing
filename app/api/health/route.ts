import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 운영 진단용 헬스체크.
 * 환경변수의 "존재 여부(boolean)"만 노출 — 값은 절대 반환하지 않는다.
 * robots.txt에서 /api/는 크롤링 차단되어 있음.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      NEXT_PUBLIC_TOSS_CLIENT_KEY: !!process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
      TOSS_SECRET_KEY: !!process.env.TOSS_SECRET_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}
