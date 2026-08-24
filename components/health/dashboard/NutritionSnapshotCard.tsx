"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { NutritionFacts } from "@/lib/api";

interface Props {
  total: NutritionFacts | null;
  foodsCount: number;
  loading?: boolean;
}

export function NutritionSnapshotCard({ total, foodsCount, loading }: Props) {
  const t = useTranslations("Nutrition");

  if (loading) {
    return (
      <div className="rounded-2xl border border-peach/20 bg-white p-4 animate-pulse">
        <div className="h-4 bg-peach/10 rounded w-1/3 mb-3" />
        <div className="h-8 bg-peach/10 rounded w-1/2" />
      </div>
    );
  }

  const isEmpty = !total || foodsCount === 0;

  return (
    <Link href="/health/nutrition" className="block group">
      <div className="rounded-2xl border border-peach/20 bg-white hover:border-peach/40 hover:shadow-md transition-all p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <h3 className="text-sm font-semibold text-ink">{t("snapshot.title")}</h3>
          </div>
          <span className="text-xs text-peach group-hover:underline">{t("actions.viewAll")} →</span>
        </div>

        {isEmpty ? (
          <p className="text-xs text-ink/50">{t("snapshot.empty")}</p>
        ) : (
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold text-ink">{Math.round(total!.calories)}</span>
              <span className="text-xs text-ink/50 ml-1">kcal</span>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-xs font-semibold text-blue-600">{total!.protein_g.toFixed(0)}g</p>
                <p className="text-xs text-ink/40">{t("nutrients.protein")}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-amber-600">{total!.carbs_g.toFixed(0)}g</p>
                <p className="text-xs text-ink/40">{t("nutrients.carbs")}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-green-600">{total!.fiber_g.toFixed(0)}g</p>
                <p className="text-xs text-ink/40">{t("nutrients.fiber")}</p>
              </div>
            </div>
            <p className="text-xs text-ink/40 ml-auto">
              {foodsCount} {t("summary.foodsLogged")}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
