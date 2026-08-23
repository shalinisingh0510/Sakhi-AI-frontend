import { useTranslations, useFormatter } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Props {
  cycleDay: number | undefined;
  latestStart: string | undefined;
  onLogPeriod: () => void;
}

export function CurrentCycleCard({ cycleDay, latestStart, onLogPeriod }: Props) {
  const t = useTranslations("CycleTracker");
  const format = useFormatter();

  return (
    <Card padding="lg" className="bg-gradient-to-br from-rose/10 to-berry/5 border-rose/20 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-rose/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-berry mb-1">
            {cycleDay ? `${t("cycleDay")} ${cycleDay}` : t("noActiveCycle")}
          </h2>
          <p className="text-sm text-ink/70">
            {latestStart 
              ? `${t("startedOn")} ${format.dateTime(new Date(latestStart), { dateStyle: 'medium' })}`
              : t("logToStart")
            }
          </p>
        </div>
        <Button onClick={onLogPeriod} variant="primary" size="sm">
          {t("logPeriod")}
        </Button>
      </div>
    </Card>
  );
}
