"use client";

import React from "react";
import { Minus, Plus, Calendar as CalendarIcon, Baby } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* FloStepper: Signature Flo-style +/- numeric stepper with slider           */
/* -------------------------------------------------------------------------- */
interface FloStepperProps {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  step?: number;
  onChange: (val: number) => void;
  helperText?: string;
  className?: string;
}

export function FloStepper({
  id,
  label,
  value,
  min,
  max,
  unit = "days",
  step = 1,
  onChange,
  helperText,
  className = "",
}: FloStepperProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
          {label}
        </label>
        {helperText && <span className="text-[11px] text-ink/50">{helperText}</span>}
      </div>

      {/* Flo Stepper Controls */}
      <div className="flex items-center justify-between rounded-2xl border border-peach/80 bg-cream/30 p-2 shadow-2xs">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-2xs hover:bg-blush/40 hover:text-berry active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 transition-all border border-peach/50"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="text-center px-4">
          <div className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
            {value}{" "}
            <span className="text-xs font-semibold text-berry/80 lowercase">{unit}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink shadow-2xs hover:bg-blush/40 hover:text-berry active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 transition-all border border-peach/50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Slider for quick range jump */}
      <div className="px-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-berry cursor-pointer h-1.5 bg-peach/40 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] font-medium text-ink/45 mt-1">
          <span>{min} {unit}</span>
          <span>{Math.round((min + max) / 2)} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FloCycleCalendar: Visual Flo-style multi-month cycle & fertility calendar */
/* -------------------------------------------------------------------------- */
interface FloCycleCalendarProps {
  lastPeriodDate: string; // YYYY-MM-DD
  periodDuration: number;
  cycleLength: number;
  monthsToShow?: number;
}

export function FloCycleCalendar({
  lastPeriodDate,
  periodDuration,
  cycleLength,
  monthsToShow = 2,
}: FloCycleCalendarProps) {
  if (!lastPeriodDate) return null;

  // Generate calendar dates for the upcoming months
  const startDate = new Date(lastPeriodDate + "T00:00:00");
  const monthList: Array<{ year: number; month: number; days: Date[] }> = [];

  for (let m = 0; m < monthsToShow; m++) {
    const curDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
    const year = curDate.getFullYear();
    const month = curDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];
    for (let d = 1; d <= numDays; d++) {
      days.push(new Date(year, month, d));
    }
    monthList.push({ year, month, days });
  }

  // Pre-calculate cycle events up to 6 cycles ahead
  interface DayClassification {
    isPeriod: boolean;
    isFertile: boolean;
    isOvulation: boolean;
    isPMS: boolean;
  }

  const dateMap = new Map<string, DayClassification>();
  const baseTimestamp = new Date(lastPeriodDate + "T00:00:00").getTime();
  const dayMs = 86400000;

  for (let c = 0; c < 6; c++) {
    const cycleStartMs = baseTimestamp + c * cycleLength * dayMs;
    const nextCycleStartMs = cycleStartMs + cycleLength * dayMs;
    const ovulationMs = nextCycleStartMs - 14 * dayMs;

    // Period days
    for (let p = 0; p < periodDuration; p++) {
      const pDate = new Date(cycleStartMs + p * dayMs).toISOString().split("T")[0];
      const existing = dateMap.get(pDate) || { isPeriod: false, isFertile: false, isOvulation: false, isPMS: false };
      existing.isPeriod = true;
      dateMap.set(pDate, existing);
    }

    // Fertile window: ovulation - 5 days to ovulation + 1 day
    for (let f = -5; f <= 1; f++) {
      const fDate = new Date(ovulationMs + f * dayMs).toISOString().split("T")[0];
      const existing = dateMap.get(fDate) || { isPeriod: false, isFertile: false, isOvulation: false, isPMS: false };
      existing.isFertile = true;
      if (f === 0) {
        existing.isOvulation = true;
      }
      dateMap.set(fDate, existing);
    }

    // PMS window: 7 days before next cycle start
    for (let pms = -7; pms < 0; pms++) {
      const pmsDate = new Date(nextCycleStartMs + pms * dayMs).toISOString().split("T")[0];
      const existing = dateMap.get(pmsDate) || { isPeriod: false, isFertile: false, isOvulation: false, isPMS: false };
      existing.isPMS = true;
      dateMap.set(pmsDate, existing);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-peach/70 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-peach/40 pb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-berry" />
            <span>Flo Cycle Calendar Visualizer</span>
          </h3>
          <p className="text-xs text-ink/65 mt-0.5">
            Your predicted period, fertile window, and ovulation days mapped on the calendar.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-ink/70">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose border border-rose/80" />
            <span>Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400 border border-emerald-500" />
            <span>Fertile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-600 border border-emerald-700 ring-2 ring-emerald-200" />
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-300 border border-amber-400" />
            <span>PMS</span>
          </div>
        </div>
      </div>

      {/* Calendars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monthList.map((mObj, idx) => {
          const monthName = mObj.days[0].toLocaleDateString(undefined, { month: "long", year: "numeric" });
          const firstDayWeekday = (mObj.days[0].getDay() + 6) % 7; // Monday = 0

          return (
            <div key={idx} className="space-y-3">
              <div className="font-display text-sm font-bold text-ink/90 text-center uppercase tracking-wider">
                {monthName}
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-ink/50 uppercase tracking-widest">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>Su</span>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty offset days */}
                {Array.from({ length: firstDayWeekday }).map((_, emptyIdx) => (
                  <div key={`empty-${emptyIdx}`} className="h-8 w-8" />
                ))}

                {mObj.days.map((d) => {
                  const dateStr = d.toISOString().split("T")[0];
                  const info = dateMap.get(dateStr);
                  const isToday = new Date().toISOString().split("T")[0] === dateStr;

                  let cellClasses = "relative flex h-8 w-8 items-center justify-center rounded-xl font-medium transition-all mx-auto ";

                  if (info?.isOvulation) {
                    cellClasses += "bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-300/80 scale-105 ";
                  } else if (info?.isPeriod) {
                    cellClasses += "bg-rose/90 text-white font-bold shadow-2xs ";
                  } else if (info?.isFertile) {
                    cellClasses += "bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300 ";
                  } else if (info?.isPMS) {
                    cellClasses += "bg-amber-100 text-amber-900 border border-amber-200 ";
                  } else {
                    cellClasses += "text-ink/80 hover:bg-cream/70 ";
                  }

                  if (isToday) {
                    cellClasses += "outline-2 outline-berry outline-offset-1 font-bold ";
                  }

                  return (
                    <div key={dateStr} className={cellClasses} title={`${dateStr}${info?.isOvulation ? " (Ovulation Day)" : info?.isPeriod ? " (Period)" : info?.isFertile ? " (Fertile Window)" : ""}`}>
                      <span>{d.getDate()}</span>
                      {info?.isOvulation && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 ring-1 ring-white" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FloTrimesterBar: Signature pregnancy progress & fruit size comparison     */
/* -------------------------------------------------------------------------- */
const FETAL_SIZES: Record<number, { fruit: string; size: string; weight: string; icon: string }> = {
  4: { fruit: "Poppy Seed", size: "1 mm", weight: "< 1 g", icon: "🌱" },
  6: { fruit: "Sweet Pea", size: "6 mm", weight: "< 1 g", icon: "🫛" },
  8: { fruit: "Raspberry", size: "1.6 cm", weight: "1 g", icon: "🫐" },
  10: { fruit: "Prune", size: "3.1 cm", weight: "4 g", icon: "🍇" },
  12: { fruit: "Plum", size: "5.4 cm", weight: "14 g", icon: "🍑" },
  14: { fruit: "Lemon", size: "8.7 cm", weight: "43 g", icon: "🍋" },
  16: { fruit: "Avocado", size: "11.6 cm", weight: "100 g", icon: "🥑" },
  18: { fruit: "Bell Pepper", size: "14.2 cm", weight: "190 g", icon: "🫑" },
  20: { fruit: "Banana", size: "25.6 cm", weight: "300 g", icon: "🍌" },
  22: { fruit: "Papaya", size: "27.8 cm", weight: "430 g", icon: "🥭" },
  24: { fruit: "Cantaloupe", size: "30 cm", weight: "600 g", icon: "🍈" },
  26: { fruit: "Lettuce", size: "35.6 cm", weight: "760 g", icon: "🥬" },
  28: { fruit: "Eggplant", size: "37.6 cm", weight: "1 kg", icon: "🍆" },
  30: { fruit: "Cabbage", size: "39.9 cm", weight: "1.3 kg", icon: "🥬" },
  32: { fruit: "Squash", size: "42.4 cm", weight: "1.7 kg", icon: "🎃" },
  34: { fruit: "Pineapple", size: "45 cm", weight: "2.1 kg", icon: "🍍" },
  36: { fruit: "Honeydew Melon", size: "47.4 cm", weight: "2.6 kg", icon: "🍈" },
  38: { fruit: "Winter Melon", size: "49.8 cm", weight: "3.1 kg", icon: "🍉" },
  40: { fruit: "Watermelon", size: "51.2 cm", weight: "3.5 kg", icon: "🍉" },
};

function getFetalMilestone(weeks: number) {
  const keys = Object.keys(FETAL_SIZES).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (k <= weeks) closest = k;
  }
  return FETAL_SIZES[closest] || FETAL_SIZES[40];
}

interface FloTrimesterBarProps {
  currentWeek: number;
  currentDay?: number;
  totalDaysRemaining?: number;
  dueDate: string;
}

export function FloTrimesterBar({
  currentWeek,
  currentDay = 0,
  totalDaysRemaining,
  dueDate,
}: FloTrimesterBarProps) {
  const boundedWeeks = Math.max(1, Math.min(42, currentWeek));
  const progressPercent = Math.min(100, Math.round((boundedWeeks / 40) * 100));
  const milestone = getFetalMilestone(boundedWeeks);

  const trimesterIndex = boundedWeeks <= 13 ? 1 : boundedWeeks <= 27 ? 2 : 3;

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-peach/70 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-peach/40 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
            <Baby className="h-3.5 w-3.5 text-berry" />
            <span>Trimester {trimesterIndex} of 3</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
            You are {boundedWeeks} weeks {currentDay > 0 ? `and ${currentDay} days ` : ""}pregnant
          </h3>
        </div>

        {totalDaysRemaining !== undefined && (
          <div className="flex items-center gap-3 rounded-2xl bg-cream/70 border border-peach px-4 py-2 self-start sm:self-auto">
            <div className="text-center">
              <span className="block font-display text-xl sm:text-2xl font-extrabold text-berry leading-none">
                {Math.max(0, totalDaysRemaining)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                Days to Go
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Segmented Trimester Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-ink/75 mb-1">
          <span className={trimesterIndex === 1 ? "text-berry font-bold" : ""}>1st Trimester (1–13w)</span>
          <span className={trimesterIndex === 2 ? "text-berry font-bold" : ""}>2nd Trimester (14–27w)</span>
          <span className={trimesterIndex === 3 ? "text-berry font-bold" : ""}>3rd Trimester (28–40w+)</span>
        </div>

        <div className="relative h-4 w-full rounded-full bg-cream border border-peach/60 overflow-hidden flex">
          {/* Trimester 1 segment */}
          <div className="w-[32.5%] border-r border-white/60 relative">
            <div
              className="h-full bg-gradient-to-r from-peach to-rose/70 transition-all duration-700"
              style={{
                width: boundedWeeks <= 13 ? `${(boundedWeeks / 13) * 100}%` : "100%",
              }}
            />
          </div>

          {/* Trimester 2 segment */}
          <div className="w-[35%] border-r border-white/60 relative">
            <div
              className="h-full bg-gradient-to-r from-rose/70 to-berry/80 transition-all duration-700"
              style={{
                width:
                  boundedWeeks <= 13
                    ? "0%"
                    : boundedWeeks <= 27
                    ? `${((boundedWeeks - 13) / 14) * 100}%`
                    : "100%",
              }}
            />
          </div>

          {/* Trimester 3 segment */}
          <div className="w-[32.5%] relative">
            <div
              className="h-full bg-gradient-to-r from-berry/80 to-berry transition-all duration-700"
              style={{
                width:
                  boundedWeeks <= 27
                    ? "0%"
                    : `${Math.min(100, ((boundedWeeks - 27) / 13) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-ink/50 pt-0.5">
          <span>Conception</span>
          <span>Week 14</span>
          <span>Week 28</span>
          <span>Due Date ({dueDate})</span>
        </div>
      </div>

      {/* Baby Size Milestone Card */}
      <div className="rounded-2xl bg-gradient-to-br from-cream via-white to-blush/30 p-4 border border-peach/70 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl sm:text-5xl shrink-0 p-2 bg-white rounded-2xl shadow-2xs border border-peach/40">
          {milestone.icon}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-berry">
            Baby Size at Week {boundedWeeks}
          </div>
          <div className="font-display text-lg sm:text-xl font-bold text-ink">
            Size of a {milestone.fruit}
          </div>
          <div className="text-xs text-ink/70 flex flex-wrap justify-center sm:justify-start gap-3">
            <span>Length: <strong>{milestone.size}</strong></span>
            <span>•</span>
            <span>Weight: <strong>{milestone.weight}</strong></span>
            <span>•</span>
            <span>Progress: <strong>{progressPercent}% Complete</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FloHcgDoublingGauge: Visual Doubling Range indicator                       */
/* -------------------------------------------------------------------------- */
interface FloHcgDoublingGaugeProps {
  doublingTimeHours: number;
  twoDayIncreasePercent: number;
}

export function FloHcgDoublingGauge({
  doublingTimeHours,
  twoDayIncreasePercent,
}: FloHcgDoublingGaugeProps) {
  // Classification
  const isRapid = doublingTimeHours > 0 && doublingTimeHours < 48;
  const isNormal = doublingTimeHours >= 48 && doublingTimeHours <= 72;

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-peach/70 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-peach/40 pb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
            Beta hCG Doubling Gauge
          </h3>
          <p className="text-xs text-ink/65 mt-0.5">
            Clinical doubling rate benchmarks for viable early uterine pregnancies.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isNormal
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : isRapid
              ? "bg-blue-100 text-blue-800 border border-blue-300"
              : "bg-amber-100 text-amber-800 border border-amber-300"
          }`}
        >
          {isNormal ? "Normal Doubling (48–72h)" : isRapid ? "Rapid Doubling (<48h)" : "Extended Doubling (>72h)"}
        </span>
      </div>

      {/* Doubling Gauge Visual Bar */}
      <div className="space-y-2">
        <div className="relative h-6 w-full rounded-2xl bg-cream border border-peach/70 overflow-hidden flex">
          <div className="w-[30%] bg-blue-200/80 flex items-center justify-center text-[10px] font-bold text-blue-900 border-r border-white">
            &lt;48h Rapid
          </div>
          <div className="w-[35%] bg-emerald-200/90 flex items-center justify-center text-[10px] font-bold text-emerald-950 border-r border-white">
            48–72h Typical
          </div>
          <div className="w-[35%] bg-amber-200/80 flex items-center justify-center text-[10px] font-bold text-amber-950">
            &gt;72h Slower
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-ink/60">
          <span>0h</span>
          <span>48h (Clinical Benchmark)</span>
          <span>72h</span>
          <span>96h+</span>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-cream/50 p-3.5 border border-peach/50">
          <div className="text-[11px] font-semibold text-ink/60 uppercase">Calculated Doubling Time</div>
          <div className="font-display text-xl font-bold text-berry mt-0.5">
            {doublingTimeHours.toFixed(1)} hrs
          </div>
        </div>
        <div className="rounded-2xl bg-cream/50 p-3.5 border border-peach/50">
          <div className="text-[11px] font-semibold text-ink/60 uppercase">48-Hour Increase</div>
          <div className="font-display text-xl font-bold text-emerald-700 mt-0.5">
            +{twoDayIncreasePercent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
