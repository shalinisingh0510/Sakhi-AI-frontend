import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import type { CycleStatisticsResponse } from "@/lib/api";

interface Props {
  stats: CycleStatisticsResponse;
}

export function CycleStatistics({ stats }: Props) {
  const t = useTranslations("CycleTracker.statistics");

  if (stats.completed_cycles === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink">{t("title")}</h3>
      
      {stats.has_irregular_pattern && stats.irregularity_observation && (
        <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800 border border-orange-200">
          {stats.irregularity_observation}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox 
          label={t("avgCycle")} 
          value={stats.average_cycle_length ? `${Math.round(stats.average_cycle_length)} ${t("days")}` : "—"} 
        />
        <StatBox 
          label={t("avgPeriod")} 
          value={stats.average_period_duration ? `${Math.round(stats.average_period_duration)} ${t("days")}` : "—"} 
        />
        <StatBox 
          label={t("variation")} 
          value={stats.cycle_variability_days ? `${Math.round(stats.cycle_variability_days)} ${t("days")}` : "—"} 
        />
        <StatBox 
          label={t("tracked")} 
          value={stats.completed_cycles.toString()} 
        />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="sm" className="bg-white">
      <div className="text-xs text-ink/60 mb-1">{label}</div>
      <div className="text-lg font-medium text-ink">{value}</div>
    </Card>
  );
}
