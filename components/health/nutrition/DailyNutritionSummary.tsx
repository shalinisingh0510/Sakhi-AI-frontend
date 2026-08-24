"use client";

import { useTranslations } from "next-intl";
import type { NutritionFacts } from "@/lib/api";

interface Props {
  total: NutritionFacts;
  foodsCount: number;
}

export function DailyNutritionSummary({ total, foodsCount }: Props) {
  const t = useTranslations("Nutrition");

  const macros = [
    { label: t("nutrients.protein"), value: total.protein_g, unit: "g", color: "bg-blue-400" },
    { label: t("nutrients.carbs"), value: total.carbs_g, unit: "g", color: "bg-amber-400" },
    { label: t("nutrients.fat"), value: total.fat_g, unit: "g", color: "bg-rose-400" },
    { label: t("nutrients.fiber"), value: total.fiber_g, unit: "g", color: "bg-green-400" },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-peach/10 to-peach/5 border border-peach/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-ink/50 mb-0.5">{t("summary.todayTotal")}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-ink">{Math.round(total.calories)}</span>
            <span className="text-sm text-ink/50">kcal</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl">🥗</span>
          <p className="text-xs text-ink/50 mt-1">
            {foodsCount} {t("summary.foodsLogged")}
          </p>
        </div>
      </div>

      {/* Macro bars */}
      <div className="flex flex-col gap-2">
        {macros.map((m) => (
          <div key={m.label} className="flex items-center gap-3">
            <span className="text-xs text-ink/60 w-12 shrink-0">{m.label}</span>
            <div className="flex-1 bg-white/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, (m.value / 80) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-ink/80 w-12 text-right shrink-0">
              {m.value.toFixed(1)}{m.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Informational note — not a target */}
      <p className="text-xs text-ink/40 mt-4 text-center">
        {t("summary.informationalNote")}
      </p>
    </div>
  );
}
