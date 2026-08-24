"use client";

import { useTranslations } from "next-intl";
import type { MealSummaryResponse, NutritionLogItemResponse } from "@/lib/api";

interface LoggedFoodItemProps {
  item: NutritionLogItemResponse;
  onEdit: (item: NutritionLogItemResponse) => void;
  onDelete: (itemId: string) => void;
}

export function LoggedFoodItem({ item, onEdit, onDelete }: LoggedFoodItemProps) {
  const t = useTranslations("Nutrition");

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl hover:bg-peach/5 group transition">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{item.food_name_snapshot}</p>
        <p className="text-xs text-ink/50">
          {item.quantity_servings % 1 === 0
            ? item.quantity_servings
            : item.quantity_servings.toFixed(1)}
          × · {Math.round(item.quantity_grams)}g
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-semibold text-ink/80">
          {Math.round(item.calories_snapshot)} kcal
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(item)}
          className="text-ink/40 hover:text-peach text-xs px-2 py-1 rounded-lg hover:bg-peach/10 transition"
          aria-label={t("actions.edit")}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-ink/40 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition"
          aria-label={t("actions.delete")}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

interface MealSectionProps {
  meal: MealSummaryResponse;
  onEditItem: (item: NutritionLogItemResponse) => void;
  onDeleteItem: (itemId: string) => void;
  onAddFood: (mealType: string) => void;
}

const MEAL_ICONS: Record<string, string> = {
  BREAKFAST: "🌅",
  LUNCH: "☀️",
  DINNER: "🌙",
  SNACK: "🍎",
  OTHER: "🍽️",
};

export function MealSection({ meal, onEditItem, onDeleteItem, onAddFood }: MealSectionProps) {
  const t = useTranslations("Nutrition");

  return (
    <div className="rounded-2xl border border-peach/20 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-peach/5 border-b border-peach/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{MEAL_ICONS[meal.meal_type] ?? "🍽️"}</span>
          <h3 className="text-sm font-semibold text-ink">
            {t(`meals.${meal.meal_type.toLowerCase()}`)}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink/50">
            {Math.round(meal.subtotal.calories)} kcal
          </span>
          <button
            onClick={() => onAddFood(meal.meal_type)}
            className="text-xs text-peach font-medium hover:underline"
          >
            + {t("actions.addFood")}
          </button>
        </div>
      </div>
      <div className="divide-y divide-peach/5 px-1">
        {meal.items.length === 0 ? (
          <p className="text-xs text-ink/40 text-center py-4">{t("meal.empty")}</p>
        ) : (
          meal.items.map((item) => (
            <LoggedFoodItem
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </div>
    </div>
  );
}
