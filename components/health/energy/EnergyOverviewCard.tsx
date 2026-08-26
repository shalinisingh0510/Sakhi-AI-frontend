"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import type { EnergySummaryResponse } from "@/lib/api";

interface Props {
  summary: EnergySummaryResponse | null;
}

export function EnergyOverviewCard({ summary }: Props) {
  const t = useTranslations("HealthProfile.energy");

  if (!summary) {
    return (
      <Card padding="md" className="flex flex-col h-full bg-white relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h2 className="font-semibold text-lg text-ink">
              {t("title") || "Energy Overview"}
            </h2>
            <p className="text-sm text-ink/60">
              {t("subtitle") || "Calories Consumed & Burned"}
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-ink/50 text-sm">
          Loading energy data...
        </div>
      </Card>
    );
  }

  const {
    calories_consumed,
    estimated_bmr,
    activity_calories_burned,
    total_estimated_expenditure,
    energy_balance,
    calculation_status,
  } = summary;

  const isTeenRestricted = calculation_status === "TEEN_RESTRICTED";
  const isInsufficientData = calculation_status === "INSUFFICIENT_DATA";

  return (
    <Card padding="md" className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="font-semibold text-lg text-ink">
            {t("title") || "Energy Overview"}
          </h2>
          <p className="text-sm text-ink/60">
            {t("subtitle") || "Calories Consumed & Burned"}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        
        {/* Consumed row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <span className="text-sm font-medium text-ink">Consumed</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-ink text-lg">{Math.round(calories_consumed)}</span>
            <span className="text-xs text-ink/60 ml-1">kcal</span>
          </div>
        </div>
        
        {/* Burned row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-sm font-medium text-ink">Burned (Active)</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-ink text-lg">{Math.round(activity_calories_burned)}</span>
            <span className="text-xs text-ink/60 ml-1">kcal</span>
          </div>
        </div>

        {/* Conditional Full Expenditure/Balance block */}
        {isTeenRestricted ? (
          <div className="pt-4 border-t border-blush/20 text-center">
            <p className="text-xs text-ink/60 italic">
              Energy balance and total expenditure are hidden for users under 18 to promote healthy habits.
            </p>
          </div>
        ) : isInsufficientData ? (
          <div className="pt-4 border-t border-blush/20 text-center">
            <p className="text-xs text-ink/60 italic">
              Please update your profile with your weight, height, and biological sex to see your total estimated expenditure and energy balance.
            </p>
          </div>
        ) : (
          <div className="pt-4 border-t border-blush/20 space-y-3">
            <div className="flex justify-between items-center opacity-80">
              <span className="text-xs text-ink/80">Estimated BMR (Resting)</span>
              <span className="text-sm">{Math.round(estimated_bmr || 0)} kcal</span>
            </div>
            
            <div className="flex justify-between items-center bg-blush/10 p-3 rounded-lg mt-2">
              <span className="text-sm font-medium text-ink">Net Energy Balance</span>
              <div className="text-right">
                <span className={`font-semibold text-lg ${(energy_balance || 0) > 0 ? "text-orange-500" : "text-green-600"}`}>
                  {(energy_balance || 0) > 0 ? "+" : ""}{Math.round(energy_balance || 0)}
                </span>
                <span className="text-xs text-ink/60 ml-1">kcal</span>
              </div>
            </div>
            <p className="text-[10px] text-ink/40 text-center mt-1">
              Estimated Total Daily Energy Expenditure: {Math.round(total_estimated_expenditure || 0)} kcal
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
