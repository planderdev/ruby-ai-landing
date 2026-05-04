import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { Sidebar } from "@/components/dashboard/Sidebar";

// Dashboard is private — exclude from search engines
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar role={profile.role} name={profile.name} avatarUrl={profile.avatar_url} />
      <div className="flex-1 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          {children}
        </div>
      </div>
    </div>
  );
}
