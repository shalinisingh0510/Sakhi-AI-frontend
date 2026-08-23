import { useTranslations, useFormatter } from "next-intl";
import { Card } from "@/components/ui/Card";

export function CycleCalendar() {
  const t = useTranslations("CycleTracker");
  
  return (
    <Card padding="lg" className="border-peach/30 bg-white/50 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">📅</div>
      <h3 className="text-lg font-medium text-ink mb-2">{t("calendar.title")}</h3>
      <p className="text-sm text-ink/60 max-w-sm mx-auto">
        {t("calendar.comingSoon")}
      </p>
    </Card>
  );
}
