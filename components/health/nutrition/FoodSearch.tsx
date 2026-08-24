"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { FoodSearchResultResponse } from "@/lib/api";

interface Props {
  onSelect: (food: FoodSearchResultResponse) => void;
  onSearch: (query: string) => Promise<FoodSearchResultResponse[]>;
}

export function FoodSearch({ onSelect, onSearch }: Props) {
  const t = useTranslations("Nutrition");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodSearchResultResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }
      setSearching(true);
      try {
        const foods = await onSearch(q.trim());
        setResults(foods);
        setSearched(true);
      } finally {
        setSearching(false);
      }
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setSearched(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-lg">🔍</span>
          <input
            id="food-search-input"
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-peach/40 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-peach/40 text-sm transition"
            aria-label={t("search.label")}
          />
        </div>
        <button
          id="food-search-btn"
          onClick={() => handleSearch(query)}
          disabled={searching || !query.trim()}
          className="px-4 py-3 rounded-2xl bg-peach text-white text-sm font-medium hover:bg-peach/90 disabled:opacity-50 transition"
        >
          {searching ? "..." : t("search.button")}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto rounded-2xl border border-peach/20 bg-white shadow-soft p-2">
          {results.map((food) => (
            <button
              key={food.id}
              id={`food-result-${food.id}`}
              onClick={() => {
                onSelect(food);
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
              className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl hover:bg-peach/5 text-left transition group"
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-medium text-ink truncate">{food.name_en}</span>
                {food.name_hi && (
                  <span className="text-xs text-ink/50">{food.name_hi}</span>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-ink/50 capitalize">{food.category.toLowerCase().replace("_", " ")}</span>
                  {!food.is_diet_compatible && (
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      {t("badges.dietMismatch")}
                    </span>
                  )}
                  {food.allergen_warnings.map((w) => (
                    <span key={w} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      ⚠ {w}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-ink/80">
                  {Math.round(food.calories_per_100g)}
                </span>
                <span className="text-xs text-ink/40 block">kcal/100g</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && !searching && (
        <p className="text-sm text-ink/50 text-center py-4">{t("search.noResults")}</p>
      )}
    </div>
  );
}
