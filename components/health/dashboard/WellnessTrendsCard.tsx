import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { type WellnessTrendsSnapshot } from "@/lib/api";

interface Props {
  trends: WellnessTrendsSnapshot;
}

export function WellnessTrendsCard({ trends }: Props) {
  const t = useTranslations("Wellness.dashboard");

  return (
    <Card padding="md">
      <h3 className="font-medium text-ink flex items-center gap-2 mb-4">
        <span aria-hidden="true">📈</span> {t("trendsTitle", { fallback: "Recent Wellness" })}
      </h3>

      <div className="flex flex-col gap-3">
        <div className="bg-blush/10 rounded-xl p-3 flex justify-between items-center border border-blush/20">
          <span className="text-sm text-ink/70">Check-ins last 7 days</span>
          <span className="font-medium text-ink bg-white px-2 py-0.5 rounded-full text-sm border border-blush/30 shadow-sm">
            {trends.check_ins_last_7} / 7
          </span>
        </div>
        
        <div className="bg-blush/10 rounded-xl p-3 flex justify-between items-center border border-blush/20">
          <span className="text-sm text-ink/70">Symptoms logged (30 days)</span>
          <span className="font-medium text-ink bg-white px-2 py-0.5 rounded-full text-sm border border-blush/30 shadow-sm">
            {trends.symptom_days_last_30} days
          </span>
        </div>
      </div>
      
      <p className="text-xs text-ink/50 mt-4 text-center">
        {t("symptomSummary", { 
          days: 30, 
          count: trends.symptom_days_last_30, 
          checkins: trends.check_ins_last_30 
        })}
      </p>
    </Card>
  );
}
