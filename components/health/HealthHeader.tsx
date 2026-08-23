import { useTranslations } from "next-intl";

export function HealthHeader() {
  const t = useTranslations("Health");

  return (
    <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-berry md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-ink/70 mt-1 max-w-xl text-sm md:text-base">
          {t("subtitle")}
        </p>
      </div>
    </header>
  );
}
