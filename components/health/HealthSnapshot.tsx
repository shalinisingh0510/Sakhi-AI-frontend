import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

export function HealthSnapshot() {
  const t = useTranslations("Health");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Placeholders for future phases */}
      <Card padding="md" className="flex flex-col gap-2">
        <h3 className="font-medium text-ink/80">{t("cycle")}</h3>
        <p className="text-sm text-ink/50">{t("comingSoon")}</p>
      </Card>
      
      <Card padding="md" className="flex flex-col gap-2">
        <h3 className="font-medium text-ink/80">{t("nutrition")}</h3>
        <p className="text-sm text-ink/50">{t("comingSoon")}</p>
      </Card>
      
      <Card padding="md" className="flex flex-col gap-2">
        <h3 className="font-medium text-ink/80">{t("activity")}</h3>
        <p className="text-sm text-ink/50">{t("comingSoon")}</p>
      </Card>
      
      <Card padding="md" className="flex flex-col gap-2">
        <h3 className="font-medium text-ink/80">{t("symptoms")}</h3>
        <p className="text-sm text-ink/50">{t("comingSoon")}</p>
      </Card>
    </div>
  );
}
