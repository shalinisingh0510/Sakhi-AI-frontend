import { useTranslations } from "next-intl";
import { type TodaySnapshot } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface Props {
  today: TodaySnapshot;
}

export function SymptomsSnapshotCard({ today }: Props) {
  const t = useTranslations("Wellness.dashboard.symptoms");

  return (
    <Card padding="md" className="border-berry/10 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink flex items-center gap-2">
          {t("title", { fallback: "Today's symptoms" })}
        </h3>
        <Link href="/health/symptoms" className="text-xs text-berry hover:underline font-medium">
          {t("viewAll", { fallback: "View all" })}
        </Link>
      </div>

      {today.symptoms_count === 0 ? (
        <p className="text-sm text-ink/60">{t("noSymptoms", { fallback: "No symptoms logged today." })}</p>
      ) : (
        <ul className="space-y-2">
          {today.symptoms.map((s, idx) => (
            <li key={idx} className="flex justify-between items-center text-sm border-b border-blush/20 pb-2 last:border-0 last:pb-0">
              <span className="text-ink">{s.symptom_code}</span>
              <span className="text-ink/60 capitalize text-xs bg-blush/20 px-2 py-1 rounded-full">{s.severity}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
