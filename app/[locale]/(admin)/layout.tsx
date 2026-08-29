"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/en/login");
      return;
    }
    if (user?.role !== "admin") {
      router.replace("/en/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-berry" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-base font-bold text-ink">Sakhi Admin</h1>
              <p className="text-xs text-ink/50">Content Management System</p>
            </div>
          </div>
          <span className="rounded-full bg-berry/10 px-3 py-1 text-xs font-semibold text-berry">
            {user?.name}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
