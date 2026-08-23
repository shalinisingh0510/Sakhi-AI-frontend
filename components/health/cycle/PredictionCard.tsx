import { useTranslations, useFormatter } from "next-intl";
import { Card } from "@/components/ui/Card";

interface Props {
  title: string;
  date: string;
  confidence: string;
  icon: string;
}

export function PredictionCard({ title, date, confidence, icon }: Props) {
  const t = useTranslations("CycleTracker");
  const format = useFormatter();
  
  const isLowConfidence = confidence === "LOW";

  return (
    <Card padding="md" className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-ink/60 text-sm font-medium">
        <span aria-hidden="true">{icon}</span>
        {title}
      </div>
      
      <div className="text-xl font-semibold text-ink">
        {format.dateTime(new Date(date), { dateStyle: "medium" })}
      </div>
      
      {isLowConfidence && (
        <div className="text-xs text-ink/50 bg-gray-50 rounded px-2 py-1 self-start">
          {t("estimates.lowConfidence")}
        </div>
      )}
    </Card>
  );
}
