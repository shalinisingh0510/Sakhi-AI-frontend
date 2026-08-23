import { useTranslations, useFormatter } from "next-intl";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { MenstrualCycleResponse } from "@/lib/api";

interface Props {
  cycles: MenstrualCycleResponse[];
}

export function CycleHistory({ cycles }: Props) {
  const t = useTranslations("CycleTracker.history");
  const format = useFormatter();

  if (cycles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{t("title")}</h3>
        <Link href="/health/cycle/history" className="text-sm font-medium text-berry hover:underline">
          {t("viewAll")}
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {cycles.slice(0, 3).map((cycle) => (
          <Card key={cycle.id} padding="sm" className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink">
                {format.dateTime(new Date(cycle.cycle_start_date), { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-xs text-ink/60">
                {format.dateTime(new Date(cycle.cycle_start_date), { dateStyle: 'medium' })}
                {cycle.cycle_end_date && ` – ${format.dateTime(new Date(cycle.cycle_end_date), { dateStyle: 'medium' })}`}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-ink">
                {cycle.cycle_length_days ? `${cycle.cycle_length_days} ${t("days")}` : t("current")}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
