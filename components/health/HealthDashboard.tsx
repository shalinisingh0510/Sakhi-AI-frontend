"use client";

import { useTranslations } from "next-intl";
import { type WellnessDashboardResponse } from "@/lib/api";
import { WellnessDashboardHeader } from "./dashboard/WellnessDashboardHeader";
import { TodayCheckInCard } from "./dashboard/TodayCheckInCard";
import { CycleSnapshotCard } from "./dashboard/CycleSnapshotCard";
import { WellnessTrendsCard } from "./dashboard/WellnessTrendsCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const COMING_SOON_MODULES = [
  { icon: "🥗", key: "nutrition", label: "Nutrition & Diet" },
  { icon: "🏃‍♀️", key: "activity", label: "Activity" },
];

interface Props {
  data: WellnessDashboardResponse;
}

export function HealthDashboard({ data }: Props) {
  const t = useTranslations("HealthProfile");
  
  // Need to extract raw profile data for isCycleTrackingEnabled
  // We don't have the full HealthProfileData object anymore, but the Dashboard API
  // currently doesn't export whether cycle tracking is enabled explicitly in the profile snippet.
  // Wait, if it wasn't enabled, cycle_status would be "Not Tracked". 
  const isCycleTrackingEnabled = data.tracking_status.cycle_status !== "Not Tracked";

  return (
    <div className="flex flex-col gap-6 py-6">
      <WellnessDashboardHeader profile={data.profile} />

      <TodayCheckInCard today={data.today} />

      {isCycleTrackingEnabled && (
        <CycleSnapshotCard cycle={data.cycle} isCycleTrackingEnabled={isCycleTrackingEnabled} />
      )}

      <WellnessTrendsCard trends={data.trends} />

      {/* Health Hub Modules (Quick Links) */}
      <div className="mt-2">
        <h3 className="mb-3 text-sm font-medium text-ink/60 uppercase tracking-wide">
          Explore Health Hub
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link href="/health/check-in" className="block h-full">
            <Card padding="md" className="flex flex-col items-center justify-center gap-2 text-center hover:bg-peach/5 transition-colors h-full border border-peach/20 bg-white">
              <span className="text-2xl" aria-hidden="true">📝</span>
              <span className="text-sm font-medium text-ink">Check-in</span>
            </Card>
          </Link>
          
          <Link href="/health/cycle" className="block h-full">
            <Card padding="md" className="flex flex-col items-center justify-center gap-2 text-center hover:bg-peach/5 transition-colors h-full border border-peach/20 bg-white">
              <span className="text-2xl" aria-hidden="true">🌸</span>
              <span className="text-sm font-medium text-ink">Cycle</span>
            </Card>
          </Link>
          
          <Link href="/health/symptoms" className="block h-full">
            <Card padding="md" className="flex flex-col items-center justify-center gap-2 text-center hover:bg-peach/5 transition-colors h-full border border-peach/20 bg-white">
              <span className="text-2xl" aria-hidden="true">💭</span>
              <span className="text-sm font-medium text-ink">Logs</span>
            </Card>
          </Link>

          <Link href="/profile" className="block h-full">
            <Card padding="md" className="flex flex-col items-center justify-center gap-2 text-center hover:bg-peach/5 transition-colors h-full border border-peach/20 bg-white">
              <span className="text-2xl" aria-hidden="true">⚙️</span>
              <span className="text-sm font-medium text-ink">Settings</span>
            </Card>
          </Link>
        </div>
      </div>
      
      {/* Coming Soon Features */}
      <div className="mt-2">
        <h3 className="mb-3 text-sm font-medium text-ink/60 uppercase tracking-wide">
          {t("dashboard.comingSoon", { fallback: "Features coming soon" })}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {COMING_SOON_MODULES.map((mod) => (
            <Card key={mod.key} padding="md" className="flex flex-col items-center gap-2 text-center opacity-60 bg-gray-50/50">
              <span className="text-2xl" aria-hidden="true">{mod.icon}</span>
              <span className="text-sm font-medium text-ink">
                {mod.label}
              </span>
              <span className="text-xs text-ink/40">Coming Soon</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
