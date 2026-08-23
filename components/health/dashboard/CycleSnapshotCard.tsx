import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { type CycleSnapshot } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

interface Props {
  cycle: CycleSnapshot;
  isCycleTrackingEnabled: boolean;
}

export function CycleSnapshotCard({ cycle, isCycleTrackingEnabled }: Props) {
  const t = useTranslations("Wellness.dashboard");

  if (!isCycleTrackingEnabled) {
    return null; // Don't show the cycle card if cycle tracking isn't enabled
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink flex items-center gap-2">
          <span aria-hidden="true">🌸</span> {t("cycleTitle", { fallback: "Cycle" })}
        </h3>
        <Link href="/health/cycle" className="text-xs text-berry hover:underline font-medium">
          {t("viewCycle", { fallback: "View cycle" })}
        </Link>
      </div>

      {cycle.cycle_day ? (
        <div className="flex flex-col gap-3">
          <div className="bg-berry/5 rounded-xl p-4 border border-berry/10 text-center">
            <span className="block text-sm text-ink/60 mb-1">{t("cycleDay", { day: "" })}</span>
            <span className="text-3xl font-semibold text-berry">Day {cycle.cycle_day}</span>
          </div>

          {(cycle.next_period || cycle.ovulation) && (
            <div className="grid grid-cols-2 gap-3 mt-1">
              {cycle.next_period && (
                <div className="bg-blush/10 rounded-xl p-3 border border-blush/20">
                  <span className="block text-xs text-ink/50 mb-1">{t("nextPeriod", { fallback: "Next period" })}</span>
                  <span className="font-medium text-ink text-sm">
                    {format(new Date(cycle.next_period), "MMM d")}
                  </span>
                </div>
              )}
              {cycle.ovulation && (
                <div className="bg-blush/10 rounded-xl p-3 border border-blush/20">
                  <span className="block text-xs text-ink/50 mb-1">{t("ovulation", { fallback: "Ovulation" })}</span>
                  <span className="font-medium text-ink text-sm">
                    {format(new Date(cycle.ovulation), "MMM d")}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {cycle.confidence === "LIMITED" && (
            <p className="text-xs text-ink/50 mt-1 flex items-center gap-1">
              <span>⚠️</span> {t("lowConfidence", { fallback: "Keep tracking your periods to get personalized cycle estimates." })}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-blush/10 rounded-xl p-4 border border-blush/20 text-center">
          <p className="text-sm text-ink/60 mb-2">No active cycle detected.</p>
          <Link href="/health/cycle" className="text-sm text-berry font-medium hover:underline">
            Log your period to start tracking
          </Link>
        </div>
      )}
    </Card>
  );
}
