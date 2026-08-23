import { useTranslations, useFormatter } from "next-intl";
import { Card } from "@/components/ui/Card";
import { CycleDisclaimer } from "./CycleDisclaimer";

interface Props {
  start: string;
  end: string;
  confidence: string;
}

export function FertileWindowCard({ start, end, confidence }: Props) {
  const t = useTranslations("CycleTracker");
  const format = useFormatter();

  const isLowConfidence = confidence === "LOW";
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format as "Aug 20–26" or "Aug 30 – Sep 4"
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const formattedRange = sameMonth
    ? `${format.dateTime(startDate, { month: 'short', day: 'numeric' })}–${format.dateTime(endDate, { day: 'numeric' })}`
    : `${format.dateTime(startDate, { month: 'short', day: 'numeric' })} – ${format.dateTime(endDate, { month: 'short', day: 'numeric' })}`;

  return (
    <Card padding="md" className="border-blue-100 bg-blue-50/30">
      <div className="flex items-center gap-2 text-blue-700/80 text-sm font-medium mb-2">
        <span aria-hidden="true">✨</span>
        {t("fertileWindow.title")}
      </div>
      
      <div className="text-xl font-semibold text-blue-900 mb-2">
        {formattedRange}
      </div>
      
      {isLowConfidence && (
        <div className="text-xs text-blue-800/60 bg-blue-100/50 rounded px-2 py-1 self-start inline-block mb-2">
          {t("estimates.lowConfidence")}
        </div>
      )}

      <CycleDisclaimer />
    </Card>
  );
}
