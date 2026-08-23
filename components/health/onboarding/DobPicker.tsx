"use client";

import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/Select";

interface DobPickerProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
  error?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DobPicker({
  day, month, year,
  onDayChange, onMonthChange, onYearChange,
  error,
}: DobPickerProps) {
  const t = useTranslations("HealthProfile");

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));

  const months = MONTHS.map((m, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: m,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink mb-2">
        {t("aboutYou.dobLabel")}
      </legend>
      <div className="grid grid-cols-3 gap-3">
        <Select
          id="dob-day"
          aria-label={t("aboutYou.dobDay")}
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          options={days}
          placeholder={t("aboutYou.dobDay")}
        />
        <Select
          id="dob-month"
          aria-label={t("aboutYou.dobMonth")}
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          options={months}
          placeholder={t("aboutYou.dobMonth")}
        />
        <Select
          id="dob-year"
          aria-label={t("aboutYou.dobYear")}
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          options={years}
          placeholder={t("aboutYou.dobYear")}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
