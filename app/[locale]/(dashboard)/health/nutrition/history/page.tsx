"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { nutritionApi, type NutritionHistoryResponse } from "@/lib/api";

export default function NutritionHistoryPage() {
  const t = useTranslations("Nutrition");
  const { user } = useAuthStore();
  const token = user ? (useAuthStore.getState() as any).token : null;

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0];

  const [history, setHistory] = useState<NutritionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await nutritionApi.getHistory(token, startDate, endDate);
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleFilter = () => fetchHistory();

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{t("history.title")}</h1>
          <p className="text-sm text-ink/50 mt-0.5">{t("history.subtitle")}</p>
        </div>
        <Link href="/health/nutrition" className="text-sm text-peach font-medium hover:underline">
          ← {t("hub.title")}
        </Link>
      </div>

      {/* Date range filter */}
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-peach/20 p-4">
        <div className="flex-1">
          <label className="block text-xs text-ink/50 mb-1">{t("history.from")}</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-peach/20 focus:outline-none focus:ring-2 focus:ring-peach/30"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-ink/50 mb-1">{t("history.to")}</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-peach/20 focus:outline-none focus:ring-2 focus:ring-peach/30"
          />
        </div>
        <button
          onClick={handleFilter}
          className="mt-5 px-4 py-2 bg-peach text-white text-sm rounded-xl font-medium hover:bg-peach/90 transition"
        >
          {t("history.apply")}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-peach/10 rounded-2xl" />
          ))}
        </div>
      ) : !history || history.entries.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">📅</span>
          <p className="text-ink/60 text-sm">{t("history.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.entries.map((entry) => {
            const date = new Date(entry.log_date + "T00:00:00");
            return (
              <div
                key={entry.log_date}
                className="bg-white rounded-2xl border border-peach/20 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {date.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {entry.foods_logged_count} {t("summary.foodsLogged")}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-bold text-ink">
                      {Math.round(entry.total.calories)}
                    </p>
                    <p className="text-xs text-ink/40">kcal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-blue-600">
                      {entry.total.protein_g.toFixed(0)}g
                    </p>
                    <p className="text-xs text-ink/40">{t("nutrients.protein")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-600">
                      {entry.total.fiber_g.toFixed(0)}g
                    </p>
                    <p className="text-xs text-ink/40">{t("nutrients.fiber")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
