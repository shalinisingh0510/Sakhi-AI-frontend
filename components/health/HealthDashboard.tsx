"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { type HealthProfileData } from "@/lib/api";

const COMING_SOON_MODULES = [
  { icon: "🌸", key: "cycle" },
  { icon: "🥗", key: "nutrition" },
  { icon: "🏃‍♀️", key: "activity" },
  { icon: "💭", key: "symptoms" },
];

interface Props {
  profile: HealthProfileData;
}

export function HealthDashboard({ profile }: Props) {
  const t = useTranslations("HealthProfile");
  const isTeenMode = profile.age_band === "teen";

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Banner */}
      <Card padding="lg" className="bg-gradient-to-br from-berry/5 to-peach/20 border-berry/10">
        <div className="flex items-start gap-4">
          <div className="text-3xl" aria-hidden="true">🌺</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-ink">{t("dashboard.profileComplete")}</h2>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-medium">
                ✓ {t("dashboard.configured")}
              </span>
            </div>
            <p className="text-sm text-ink/60">{t("dashboard.welcomeBack")}</p>

            {/* Wellness mode badge */}
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isTeenMode
                  ? "bg-blue-50 text-blue-700"
                  : "bg-berry/10 text-berry"
              }`}
            >
              {isTeenMode ? "🌱" : "🌺"}
              {isTeenMode ? t("dashboard.teenMode") : t("dashboard.adultMode")}
            </span>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t("dashboard.diet")} value={profile.diet_type.replace("_", " ")} />
        <StatCard label={t("dashboard.activity")} value={profile.activity_level.replace("_", " ")} />
        <StatCard
          label={t("dashboard.cycleTracking")}
          value={profile.cycle_tracking_enabled ? t("dashboard.enabled") : t("dashboard.disabled")}
        />
        <StatCard
          label="AI Personalization"
          value={profile.ai_health_personalization_enabled ? t("dashboard.enabled") : t("dashboard.disabled")}
        />
      </div>

      {/* Coming soon modules */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-ink/60 uppercase tracking-wide">
          {t("dashboard.comingSoon")}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COMING_SOON_MODULES.map((mod) => (
            <Card key={mod.key} padding="md" className="flex flex-col items-center gap-2 text-center opacity-60">
              <span className="text-2xl" aria-hidden="true">{mod.icon}</span>
              <span className="text-sm font-medium text-ink">
                {t(`Health.${mod.key}` as any)}
              </span>
              <span className="text-xs text-ink/40">{t("Health.comingSoon")}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="sm" className="flex flex-col gap-1">
      <span className="text-xs text-ink/50 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-ink capitalize">{value.toLowerCase()}</span>
    </Card>
  );
}
