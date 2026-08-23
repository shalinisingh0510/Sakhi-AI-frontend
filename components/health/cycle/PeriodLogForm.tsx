"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface Props {
  onSubmit: (date: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PeriodLogForm({ onSubmit, onCancel, isLoading }: Props) {
  const t = useTranslations("CycleTracker.logForm");
  
  // Format today as YYYY-MM-DD for the date input default
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [startDate, setStartDate] = useState(todayStr);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setError(t("errorRequired"));
      return;
    }
    
    // Basic future date validation
    if (new Date(startDate) > new Date()) {
      setError(t("errorFuture"));
      return;
    }

    setError("");
    try {
      await onSubmit(startDate);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to log period");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="period-start" className="block text-sm font-medium text-ink mb-1">
          {t("startDate")}
        </label>
        <input
          id="period-start"
          type="date"
          value={startDate}
          max={todayStr}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border border-peach/60 bg-white px-4 py-2 text-ink focus:border-berry focus:outline-none focus:ring-1 focus:ring-berry"
          disabled={isLoading}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
