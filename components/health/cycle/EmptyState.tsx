import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface Props {
  onLogPeriod: () => void;
  variant: "NO_DATA" | "INSUFFICIENT" | "LIMITED";
}

export function EmptyState({ onLogPeriod, variant }: Props) {
  const t = useTranslations("CycleTracker.emptyState");

  return (
    <div className="flex flex-col items-center text-center p-8 border border-dashed border-peach/50 rounded-3xl bg-peach/5">
      <div className="text-4xl mb-4" aria-hidden="true">
        {variant === "NO_DATA" ? "🌸" : "⏳"}
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">
        {t(`${variant}.title`)}
      </h3>
      <p className="text-sm text-ink/70 mb-6 max-w-sm">
        {t(`${variant}.description`)}
      </p>
      
      {variant === "NO_DATA" && (
        <Button onClick={onLogPeriod} variant="primary">
          {t("logFirstPeriod")}
        </Button>
      )}
    </div>
  );
}
