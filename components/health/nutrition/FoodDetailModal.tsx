"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { FoodDetailResponse, FoodServingOptionResponse } from "@/lib/api";

interface Props {
  food: FoodDetailResponse;
  onLog: (data: {
    food_id: string;
    serving_option_id?: string;
    quantity_servings: number;
    meal_type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";
    log_date: string;
  }) => Promise<void>;
  onClose: () => void;
  defaultDate?: string;
}

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"] as const;
const MEAL_ICONS: Record<string, string> = {
  BREAKFAST: "🌅",
  LUNCH: "☀️",
  DINNER: "🌙",
  SNACK: "🍎",
  OTHER: "🍽️",
};

export function FoodDetailModal({ food, onLog, onClose, defaultDate }: Props) {
  const t = useTranslations("Nutrition");
  const today = defaultDate ?? new Date().toISOString().split("T")[0];

  const defaultServing = food.serving_options.find((s) => s.is_default) ?? food.serving_options[0];
  const [selectedServing, setSelectedServing] = useState<FoodServingOptionResponse | undefined>(defaultServing);
  const [quantity, setQuantity] = useState(1);
  const [meal, setMeal] = useState<typeof MEAL_TYPES[number]>("LUNCH");
  const [logDate, setLogDate] = useState(today);
  const [submitting, setSubmitting] = useState(false);

  const resolvedGrams = selectedServing
    ? selectedServing.quantity_grams * quantity
    : 100 * quantity;
  const multiplier = resolvedGrams / 100;
  const calcCalories = Math.round(food.calories_per_100g * multiplier);
  const calcProtein = (food.protein_g * multiplier).toFixed(1);
  const calcCarbs = (food.carbs_g * multiplier).toFixed(1);
  const calcFat = (food.fat_g * multiplier).toFixed(1);
  const calcFiber = (food.fiber_g * multiplier).toFixed(1);

  const handleLog = async () => {
    setSubmitting(true);
    try {
      await onLog({
        food_id: food.id,
        serving_option_id: selectedServing?.id,
        quantity_servings: quantity,
        meal_type: meal,
        log_date: logDate,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={food.name_en}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-peach/20">
          <div>
            <h2 className="text-lg font-semibold text-ink">{food.name_en}</h2>
            {food.name_hi && <p className="text-sm text-ink/50">{food.name_hi}</p>}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-ink/50">{food.category.toLowerCase().replace("_", " ")}</span>
              {food.cuisine && <span className="text-xs text-ink/40">· {food.cuisine}</span>}
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                {food.diet_type.replace("_", " ")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-2xl leading-none mt-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Allergen warnings */}
          {food.allergen_warnings.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-700">{t("allergen.warningTitle")}</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {food.allergen_warnings.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Diet compatibility */}
          {!food.is_diet_compatible && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-2xl">
              <span className="text-base shrink-0">🟠</span>
              <p className="text-sm text-orange-700">{t("badges.dietMismatch")}</p>
            </div>
          )}

          {/* Nutrition preview */}
          <div className="bg-peach/5 rounded-2xl p-4">
            <p className="text-xs text-ink/50 mb-3">{t("detail.nutritionFor", { grams: Math.round(resolvedGrams) })}</p>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { label: t("nutrients.calories"), value: String(calcCalories), unit: "kcal", highlight: true },
                { label: t("nutrients.protein"), value: calcProtein, unit: "g" },
                { label: t("nutrients.carbs"), value: calcCarbs, unit: "g" },
                { label: t("nutrients.fat"), value: calcFat, unit: "g" },
                { label: t("nutrients.fiber"), value: calcFiber, unit: "g" },
              ].map((n) => (
                <div key={n.label} className={`flex flex-col ${n.highlight ? "col-span-1" : ""}`}>
                  <span className={`text-base font-bold ${n.highlight ? "text-peach" : "text-ink"}`}>
                    {n.value}
                  </span>
                  <span className="text-xs text-ink/50">{n.unit}</span>
                  <span className="text-xs text-ink/40">{n.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Serving selection */}
          {food.serving_options.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-ink mb-2">{t("log.serving")}</label>
              <div className="flex flex-wrap gap-2">
                {food.serving_options.map((s) => (
                  <button
                    key={s.id}
                    id={`serving-${s.id}`}
                    onClick={() => setSelectedServing(s)}
                    className={`px-3 py-2 rounded-xl text-sm border transition ${
                      selectedServing?.id === s.id
                        ? "bg-peach text-white border-peach"
                        : "bg-white text-ink border-peach/30 hover:border-peach"
                    }`}
                  >
                    {s.serving_label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">{t("log.quantity")}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(0.5, q - 0.5))}
                className="w-9 h-9 rounded-full border border-peach/40 text-peach hover:bg-peach/10 text-xl font-bold flex items-center justify-center"
              >
                −
              </button>
              <span className="text-lg font-semibold text-ink w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 0.5))}
                className="w-9 h-9 rounded-full border border-peach/40 text-peach hover:bg-peach/10 text-xl font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Meal type */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">{t("log.meal")}</label>
            <div className="grid grid-cols-5 gap-2">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m}
                  id={`meal-${m}`}
                  onClick={() => setMeal(m)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-xs transition ${
                    meal === m
                      ? "bg-peach text-white border-peach"
                      : "bg-white text-ink/70 border-peach/20 hover:border-peach"
                  }`}
                >
                  <span className="text-base">{MEAL_ICONS[m]}</span>
                  <span>{t(`meals.${m.toLowerCase()}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">{t("log.date")}</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              max={today}
              className="w-full px-4 py-2.5 rounded-2xl border border-peach/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-peach/40"
            />
          </div>

          {/* Data quality notice */}
          {food.data_quality === "ESTIMATED" && (
            <p className="text-xs text-ink/40 text-center">
              {t("detail.estimatedNote")}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-peach/30 text-ink/70 text-sm font-medium hover:bg-peach/5 transition"
            >
              {t("actions.cancel")}
            </button>
            <button
              id="log-food-submit"
              onClick={handleLog}
              disabled={submitting}
              className="flex-1 py-3 rounded-2xl bg-peach text-white text-sm font-semibold hover:bg-peach/90 disabled:opacity-50 transition"
            >
              {submitting ? t("actions.logging") : t("actions.addFood")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
