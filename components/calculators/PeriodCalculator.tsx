"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, Bell } from "lucide-react";
import { calculatorsApi, type PeriodResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper, FloCycleCalendar } from "./FloCalculatorWidgets";

export function PeriodCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [lastPeriodDate, setLastPeriodDate] = useState(todayStr);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);
  const [forecastMonths, setForecastMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PeriodResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculatePeriod(lastPeriodDate, periodDuration, cycleLength, forecastMonths);
      setResult(data);
    } catch (err) {
      console.error("Period calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecastMonths, cycleLength, periodDuration, lastPeriodDate]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="period-calculator"
      title="Period Calculator: Predict Your Next 3 Cycles"
      subtitle="Anticipate when your next menstrual periods will arrive, plan ahead for events or travel, and track premenstrual syndrome (PMS) warning windows."
      badge="Essential Cycle Tracker"
      howItWorks={
        <div className="space-y-4">
          <p>
            The period calculator predicts future menstruation dates based on the mathematical regularity of your past menstrual cycle history.
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>Next Period Start Date = Start Date of Last Period + Cycle Length (days)</div>
            <div>Bleeding Window = [Next Period Start, Next Period Start + Period Duration - 1]</div>
            <div>PMS Warning Window = 7 Days Prior to Next Period Start Date</div>
          </div>
          <p>
            By forecasting 3 to 6 consecutive cycles, you can anticipate future fertile windows, prepare for upcoming PMS symptom onset, and book travel without cycle surprises.
          </p>
        </div>
      }
      faqList={[
        {
          question: "How accurate is a period calculator?",
          answer:
            "A period calculator is highly accurate for women with regular menstrual cycles (e.g. cycles that consistently last 27–30 days). Biological events such as acute stress, travel, illness, medications, or dietary shifts can occasionally delay ovulation and thereby shift your period by several days.",
        },
        {
          question: "When does PMS usually start?",
          answer:
            "Premenstrual syndrome (PMS) typically begins 5 to 7 days before your period arrives, coinciding with the late luteal phase drop in progesterone and estrogen. Symptoms commonly dissipate within 1 to 2 days after bleeding commences.",
        },
        {
          question: "What is considered a missed period?",
          answer:
            "A period is generally considered late if it hasn't started within 5 days of your projected date, and officially missed after 7 or more days. If you are sexually active, a home pregnancy test is recommended when your period is 1 or more days late.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Cycle Parameters</h2>
            <p className="text-xs text-ink/65 mt-0.5">Customize your cycle length and flow duration using the steppers.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label htmlFor="periodStart" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                When Did Your Last Period Start?
              </label>
              <input
                id="periodStart"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Flo Stepper: Period Duration */}
            <FloStepper
              id="periodDuration"
              label="How Many Days Does It Last?"
              value={periodDuration}
              min={2}
              max={10}
              unit="days"
              onChange={(val) => setPeriodDuration(val)}
              helperText="Typical: 4 to 7 days"
            />

            {/* Flo Stepper: Cycle Length */}
            <FloStepper
              id="cycleLength"
              label="Average Cycle Length"
              value={cycleLength}
              min={20}
              max={45}
              unit="days"
              onChange={(val) => setCycleLength(val)}
              helperText="Count from Day 1 to next Day 1"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Forecast Duration
              </label>
              <div className="flex rounded-2xl border border-peach bg-cream/30 p-1">
                {[3, 4, 6].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setForecastMonths(months)}
                    className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                      forecastMonths === months ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Predict Next Periods"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Next Period Countdown Banner */}
              <div className="rounded-3xl bg-gradient-to-br from-blush via-white to-peach/30 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-rose" />
                  <span>Next Period Expected</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-berry mt-2">
                  {formatDateDisplay(result.next_period_start)} – {formatDateDisplay(result.next_period_end)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  {result.days_until_next_period > 0
                    ? `Your period is estimated to arrive in ${result.days_until_next_period} days.`
                    : "Your period is expected around now."}
                </p>

                <div className="mt-4 pt-3 border-t border-peach/50 flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-ink/60 block">Ovulation Day:</span>
                    <span className="font-semibold text-ink">{formatDateDisplay(result.next_ovulation_date)}</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Flow Duration:</span>
                    <span className="font-semibold text-ink">{periodDuration} days</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Cycle Length:</span>
                    <span className="font-semibold text-ink">{cycleLength} days</span>
                  </div>
                </div>
              </div>

              {/* Flo Cycle Calendar Visualizer */}
              <FloCycleCalendar
                lastPeriodDate={lastPeriodDate}
                periodDuration={periodDuration}
                cycleLength={cycleLength}
                monthsToShow={2}
              />

              {/* Multi-Month Calendar Forecast Cards */}
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <Clock className="h-4 w-4 text-berry" />
                  <span>{forecastMonths}-Month Predictive Schedule</span>
                </h4>

                <div className="space-y-3">
                  {result.predicted_cycles.map((cyc) => (
                    <div
                      key={cyc.cycle_number}
                      className="rounded-2xl bg-white p-4 border border-peach/60 shadow-2xs hover:border-berry/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blush px-2 py-0.5 font-bold text-berry text-[10px]">
                            Cycle #{cyc.cycle_number}
                          </span>
                          <span className="font-semibold text-ink text-sm">
                            {formatDateDisplay(cyc.period_start)} – {formatDateDisplay(cyc.period_end)}
                          </span>
                        </div>
                        <p className="text-ink/65">
                          PMS Window starts: {formatDateDisplay(cyc.pms_start)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-cream/70 p-2.5 border border-peach/40 text-[11px] space-y-0.5 sm:text-right">
                        <span className="text-ink/60 block">Fertile Window:</span>
                        <span className="font-semibold text-moss">
                          {formatDateDisplay(cyc.fertile_start)} – {formatDateDisplay(cyc.fertile_end)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Banner */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Bell className="h-4 w-4 text-berry" />
                  <span>Smart Period Preparation</span>
                </span>
                <p>
                  Pack menstrual care supplies (pads, tampons, or cup) 2 to 3 days before your predicted date. If you experience cramping or bloating during your PMS window, increase magnesium and water intake.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
