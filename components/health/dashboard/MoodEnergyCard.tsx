import { useTranslations } from "next-intl";
import { type TodaySnapshot } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface Props {
  today: TodaySnapshot;
}

export function MoodEnergyCard({ today }: Props) {
  const t = useTranslations("Wellness.dashboard.moodEnergy");

  return (
    <Card padding="md" className="border-berry/10 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink flex items-center gap-2">
          {t("title", { fallback: "Mood & Energy" })}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blush/10 rounded-xl p-3 border border-blush/20 text-center flex flex-col items-center">
          <span className="block text-xs text-ink/50 uppercase mb-1">{t("mood", { fallback: "Mood" })}</span>
          {today.mood ? (
            <span className="font-medium text-ink capitalize">{today.mood.toLowerCase()}</span>
          ) : (
            <>
              <span className="text-sm text-ink/60 mb-2">{t("notLogged", { fallback: "Not logged" })}</span>
              <Link href="/health/check-in" className="text-xs text-berry hover:underline font-medium">
                {t("addMood", { fallback: "Add mood" })}
              </Link>
            </>
          )}
        </div>
        <div className="bg-blush/10 rounded-xl p-3 border border-blush/20 text-center flex flex-col items-center">
          <span className="block text-xs text-ink/50 uppercase mb-1">{t("energy", { fallback: "Energy" })}</span>
          {today.energy ? (
            <span className="font-medium text-ink capitalize">{today.energy.toLowerCase()}</span>
          ) : (
            <>
              <span className="text-sm text-ink/60 mb-2">{t("notLogged", { fallback: "Not logged" })}</span>
              <Link href="/health/check-in" className="text-xs text-berry hover:underline font-medium">
                {t("addEnergy", { fallback: "Add energy" })}
              </Link>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
