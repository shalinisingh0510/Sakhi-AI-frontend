"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  Calendar,
  Activity,
  Heart,
  Apple,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

export function HealthHeader() {
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuthStore();

  const isUserAuthenticated = Boolean(isAuthenticated && token);

  const navItems = [
    { href: "/health", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/health/tracker", label: "Cycle Tracker", icon: Calendar, exact: false },
    { href: "/health/symptoms", label: "Symptoms", icon: Heart, exact: false },
    { href: "/health/activity", label: "Activity", icon: Activity, exact: false },
    { href: "/health/nutrition", label: "Nutrition", icon: Apple, exact: false },
    { href: "/health/check-in", label: "Daily Check-in", icon: CheckCircle2, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    // Strip locale prefix if present
    const cleanPath = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    if (exact) {
      return cleanPath === href;
    }
    return cleanPath === href || cleanPath.startsWith(`${href}/`) || (href === "/health/tracker" && cleanPath.startsWith("/health/cycle"));
  };

  return (
    <header className="mb-6 space-y-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-berry md:text-3xl">
            Health & Wellness Sanctuary
          </h1>
          <p className="text-ink/70 text-xs sm:text-sm">
            Clinical cycle predictions, symptom correlation, and holistic women&apos;s wellness.
          </p>
        </div>
      </div>

      {/* Nav Tabs for Authenticated Users */}
      {isUserAuthenticated && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-peach/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "bg-berry text-white shadow-2xs"
                    : "text-ink/70 hover:bg-white hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
