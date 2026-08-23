import { useTranslations } from "next-intl";

export function CycleDisclaimer() {
  const t = useTranslations("CycleTracker.disclaimer");

  return (
    <div className="rounded-lg bg-peach/10 p-3 text-xs text-ink/70 mt-4 border border-peach/20">
      <p>
        <span className="font-semibold text-ink/80">{t("note")}:</span>{" "}
        {t("text")}
      </p>
    </div>
  );
}
