import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

export function HealthEmptyState() {
  const t = useTranslations("Health");

  return (
    <Card padding="lg" className="flex flex-col items-center justify-center text-center py-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-peach/30 text-2xl" aria-hidden="true">
        🌸
      </div>
      <h2 className="mb-2 font-display text-xl font-semibold text-berry">
        {t("comingSoon")}
      </h2>
      <p className="max-w-md text-ink/70">
        {t("comingSoonDescription")}
      </p>
    </Card>
  );
}
