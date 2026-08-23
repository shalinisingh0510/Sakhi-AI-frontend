import { useTranslations } from "next-intl";
import { type TrackingStatusSnapshot } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface Props {
  status: TrackingStatusSnapshot;
}

export function TrackingStatus({ status }: Props) {
  const t = useTranslations("Wellness.dashboard.tracking");

  return (
    <Card padding="md" className="border-berry/10 bg-white">
      <h3 className="font-medium text-ink mb-3">{t("title", { fallback: "Today's wellness" })}</h3>
      <div className="space-y-2 text-sm text-ink/80">
        <div className="flex items-center gap-2">
          {status.check_in_status === "Completed" ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-ink/40">○</span>
          )}
          <span>{t("checkin", { fallback: "Check-in" })}</span>
        </div>
        <div className="flex items-center gap-2">
          {status.cycle_status === "Tracked" ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-ink/40">○</span>
          )}
          <span>{t("cycle", { fallback: "Cycle" })}</span>
        </div>
        <div className="flex items-center gap-2">
          {status.symptoms_status === "Logged" ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-ink/40">○</span>
          )}
          <span>{t("symptoms", { fallback: "Symptoms" })}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-ink/5">
        <span className="block text-xs text-ink/50 uppercase mb-2">{t("notLogged", { fallback: "Not logged:" })}</span>
        <div className="space-y-1 text-sm text-ink/40">
          <div className="flex items-center gap-2">
            <span>○</span> <span>{t("nutrition", { fallback: "Nutrition — Coming soon" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>○</span> <span>{t("activity", { fallback: "Activity — Coming soon" })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
