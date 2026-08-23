import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { type TodaySnapshot } from "@/lib/api";
import Link from "next/link";

interface Props {
  today: TodaySnapshot;
}

export function TodayCheckInCard({ today }: Props) {
  const t = useTranslations("Wellness.dashboard");

  if (!today.check_in_completed) {
    return (
      <Card padding="lg" className="bg-gradient-to-br from-peach/10 to-blush/20 border-peach/30 text-center flex flex-col items-center">
        <div className="text-4xl mb-3" aria-hidden="true">📝</div>
        <h3 className="text-lg font-medium text-ink mb-1">
          {t("noCheckinTitle", { fallback: "How are you feeling today?" })}
        </h3>
        <p className="text-sm text-ink/60 mb-4">
          Take a moment to record your mood, energy, and symptoms.
        </p>
        <Link 
          href="/health/check-in"
          className="inline-flex items-center justify-center rounded-full bg-berry px-6 py-2.5 text-sm font-medium text-white hover:bg-berry-dark transition-colors"
        >
          {t("noCheckinAction", { fallback: "Check in" })}
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="md" className="border-berry/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink flex items-center gap-2">
          <span className="text-green-500">✓</span> {t("checkinComplete", { fallback: "Today's check-in complete" })}
        </h3>
        <Link href="/health/check-in" className="text-xs text-berry hover:underline font-medium">
          {t("updateAction", { fallback: "Update" })}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="bg-blush/10 rounded-xl p-3 border border-blush/20">
          <span className="block text-xs text-ink/50 uppercase mb-1">{t("mood", { fallback: "Mood" })}</span>
          <span className="font-medium text-ink capitalize">{today.mood ? today.mood.toLowerCase() : t("notLogged", { fallback: "Not logged" })}</span>
        </div>
        <div className="bg-blush/10 rounded-xl p-3 border border-blush/20">
          <span className="block text-xs text-ink/50 uppercase mb-1">{t("energy", { fallback: "Energy" })}</span>
          <span className="font-medium text-ink capitalize">{today.energy ? today.energy.toLowerCase() : t("notLogged", { fallback: "Not logged" })}</span>
        </div>
        <div className="bg-blush/10 rounded-xl p-3 border border-blush/20 col-span-2 sm:col-span-1">
          <span className="block text-xs text-ink/50 uppercase mb-1">Symptoms</span>
          <span className="font-medium text-ink">
            {today.symptoms_count > 0 
              ? `${today.symptoms_count} logged` 
              : "None"}
          </span>
        </div>
      </div>
    </Card>
  );
}
