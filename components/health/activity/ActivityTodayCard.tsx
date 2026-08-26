"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type ActivityDailySummary, type ActivityResponse, activityApi } from "@/lib/api";
import { ActivityLogDialog } from "./ActivityLogDialog";

interface Props {
  token: string;
  summary: ActivityDailySummary | null;
  onActivityLogged: () => void;
}

export function ActivityTodayCard({ token, summary, onActivityLogged }: Props) {
  const t = useTranslations("HealthProfile.activity");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const activities = summary?.activities || [];
  const totalDuration = summary?.total_duration_minutes || 0;
  const totalCalories = summary?.total_estimated_calories_burned || 0;

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this activity?")) return;
    setIsDeleting(id);
    try {
      await activityApi.deleteActivity(token, id);
      onActivityLogged();
    } catch (err) {
      console.error(err);
      alert("Failed to delete activity");
    } finally {
      setIsDeleting(null);
    }
  }

  function formatActivityName(name: string) {
    return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <Card padding="md" className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="font-semibold text-lg text-ink">
            {t("title") || "Activity"}
          </h2>
          <p className="text-sm text-ink/60">
            {t("subtitle") || "Movement & Exercise"}
          </p>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          + {t("add") || "Log"}
        </Button>
      </div>

      <div className="flex gap-4 mb-4 pb-4 border-b border-blush/20">
        <div>
          <span className="block text-2xl font-semibold text-ink">
            {totalDuration}
          </span>
          <span className="text-xs text-ink/60 uppercase tracking-wider">
            Mins
          </span>
        </div>
        <div>
          <span className="block text-2xl font-semibold text-ink">
            {Math.round(totalCalories)}
          </span>
          <span className="text-xs text-ink/60 uppercase tracking-wider">
            kcal
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <span className="block text-2xl mb-2">🏃‍♀️</span>
            <p className="text-sm text-ink/50">
              {t("empty") || "No activity logged today"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {activities.map((a: ActivityResponse) => (
              <li key={a.id} className="flex justify-between items-center text-sm p-3 bg-blush/10 rounded-lg">
                <div>
                  <div className="font-medium text-ink">{formatActivityName(a.activity_type)}</div>
                  <div className="text-xs text-ink/60">{a.duration_minutes} min • {a.intensity.toLowerCase()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-ink">{Math.round(a.estimated_calories_burned)} kcal</span>
                  <button 
                    onClick={() => handleDelete(a.id)}
                    disabled={isDeleting === a.id}
                    className="text-ink/40 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ActivityLogDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        token={token}
        onSuccess={() => {
          setIsDialogOpen(false);
          onActivityLogged();
        }}
      />
    </Card>
  );
}
