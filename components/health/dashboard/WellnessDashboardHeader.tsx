import { useTranslations } from "next-intl";
import { type DashboardProfileSnapshot } from "@/lib/api";

interface Props {
  profile: DashboardProfileSnapshot;
}

export function WellnessDashboardHeader({ profile }: Props) {
  const t = useTranslations("Wellness.dashboard");
  const isTeenMode = profile.mode === "teen";

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-ink">
        {t("title", { fallback: "Your Wellness Today" })}
      </h1>
      <p className="text-ink/60 mt-1">
        {t("greeting", { name: "there" })}
      </p>

      {/* Wellness mode badge */}
      <span
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          isTeenMode
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "bg-berry/10 text-berry border border-berry/20"
        }`}
      >
        {isTeenMode ? "🌱" : "🌺"}
        {isTeenMode ? "Teen Wellness Mode" : "Adult Wellness Mode"}
      </span>
    </div>
  );
}
