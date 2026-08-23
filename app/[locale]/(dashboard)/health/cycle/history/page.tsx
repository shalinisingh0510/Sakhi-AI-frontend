"use client";

import { useState, useEffect } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { cycleApi, type MenstrualCycleResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CycleHistoryPage() {
  const t = useTranslations("CycleTracker.history");
  const format = useFormatter();
  const token = useAuthStore((s) => s.token);
  
  const [cycles, setCycles] = useState<MenstrualCycleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    cycleApi.listCycles(token, 50).then(setCycles).finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return <div className="py-12 text-center text-ink/50">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
        <Button onClick={() => window.history.back()} variant="ghost" size="sm">
          ← Back
        </Button>
      </div>

      <div className="space-y-3">
        {cycles.map((cycle) => (
          <Card key={cycle.id} padding="md" className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink text-lg">
                {format.dateTime(new Date(cycle.cycle_start_date), { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-sm text-ink/60 mt-1">
                {format.dateTime(new Date(cycle.cycle_start_date), { dateStyle: 'medium' })}
                {cycle.cycle_end_date && ` – ${format.dateTime(new Date(cycle.cycle_end_date), { dateStyle: 'medium' })}`}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-ink text-xl">
                {cycle.cycle_length_days ? `${cycle.cycle_length_days} ${t("days")}` : t("current")}
              </div>
              {cycle.period_duration_days && (
                <div className="text-xs text-ink/50 mt-1">
                  Period: {cycle.period_duration_days} days
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
