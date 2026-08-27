"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import {
  nutritionApi,
  type FoodSearchResultResponse,
  type FoodDetailResponse,
  type DailyNutritionResponse,
  type NutritionLogItemCreate,
  type NutritionLogItemResponse,
} from "@/lib/api";
import { FoodSearch } from "@/components/health/nutrition/FoodSearch";
import { FoodDetailModal } from "@/components/health/nutrition/FoodDetailModal";
import { MealSection } from "@/components/health/nutrition/MealSection";
import { DailyNutritionSummary } from "@/components/health/nutrition/DailyNutritionSummary";

type ModalState =
  | { type: "none" }
  | { type: "detail"; food: FoodDetailResponse; defaultMeal?: string }
  | { type: "edit"; item: NutritionLogItemResponse };

export default function NutritionPage() {
  const t = useTranslations("Nutrition");
  const { user } = useAuthStore();
  const token = user ? useAuthStore.getState().token : null;

  const today = new Date().toISOString().split("T")[0];
  const [summary, setSummary] = useState<DailyNutritionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchSummary = useCallback(async () => {
    if (!token) return;
    try {
      const data = await nutritionApi.getTodaySummary(token, today);
      setSummary(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load nutrition data");
      }
    } finally {
      setLoading(false);
    }
  }, [token, today]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleSearch = useCallback(
    async (query: string): Promise<FoodSearchResultResponse[]> => {
      if (!token) return [];
      const res = await nutritionApi.searchFoods(token, { q: query, page_size: 15 });
      return res.results;
    },
    [token]
  );

  const handleSelectFood = async (food: FoodSearchResultResponse, defaultMeal?: string) => {
    if (!token) return;
    const detail = await nutritionApi.getFoodDetail(token, food.id);
    setModal({ type: "detail", food: detail, defaultMeal });
  };

  const handleLogFood = async (data: NutritionLogItemCreate) => {
    if (!token) return;
    await nutritionApi.logFood(token, data);
    showToast(t("toast.foodLogged"));
    await fetchSummary();
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;
    await nutritionApi.deleteLogItem(token, itemId);
    showToast(t("toast.foodDeleted"));
    await fetchSummary();
  };

  const handleAddFoodForMeal = async () => {
    // If user clicks "+ Add food" on a specific meal, pre-populate meal
    // We open the search with the selected meal preset
    if (!token) return;
    // Simply open in add mode with a default meal — user can search
    setModal({ type: "none" });
    // We'll just focus the search. The search → select flow sets meal via modal.
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-ink/60">{t("errors.notAuthenticated")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse">
        <div className="h-32 bg-peach/10 rounded-3xl" />
        <div className="h-40 bg-peach/5 rounded-2xl" />
        <div className="h-40 bg-peach/5 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-ink/70">{error}</p>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 rounded-xl bg-peach text-white text-sm font-medium"
        >
          {t("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-2xl text-sm shadow-lg animate-bounce">
          ✓ {toastMsg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{t("hub.title")}</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            {new Date(today).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/health/nutrition/history"
          className="text-sm text-peach font-medium hover:underline"
        >
          {t("hub.history")}
        </Link>
      </div>

      {/* Daily summary */}
      {summary && !summary.is_empty ? (
        <DailyNutritionSummary total={summary.total} foodsCount={summary.foods_logged_count} />
      ) : (
        <div className="rounded-2xl bg-peach/5 border border-peach/20 p-6 text-center">
          <span className="text-4xl mb-3 block">🥗</span>
          <p className="text-sm font-medium text-ink">{t("hub.emptyTitle")}</p>
          <p className="text-xs text-ink/50 mt-1">{t("hub.emptySubtitle")}</p>
        </div>
      )}

      {/* Food search */}
      <div className="rounded-2xl border border-peach/20 bg-white p-5">
        <h2 className="text-sm font-semibold text-ink mb-3">{t("search.title")}</h2>
        <FoodSearch
          onSearch={handleSearch}
          onSelect={(food) => handleSelectFood(food)}
        />
      </div>

      {/* Meal sections */}
      {summary && summary.meals.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-ink">{t("hub.todaysMeals")}</h2>
          {summary.meals.map((meal) => (
            <MealSection
              key={meal.meal_type}
              meal={meal}
              onEditItem={(item) => setModal({ type: "edit", item })}
              onDeleteItem={handleDeleteItem}
              onAddFood={() => handleAddFoodForMeal()}
            />
          ))}
        </div>
      )}

      {/* Food detail modal */}
      {modal.type === "detail" && (
        <FoodDetailModal
          food={modal.food}
          onLog={handleLogFood}
          onClose={() => setModal({ type: "none" })}
          defaultDate={today}
        />
      )}
    </div>
  );
}
