"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Heart, Info, Clock } from "lucide-react";
import { calculatorsApi, type OvulationResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper, FloCycleCalendar } from "./FloCalculatorWidgets";

export function OvulationCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [lastPeriodDate, setLastPeriodDate] = useState(todayStr);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OvulationResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateOvulation(lastPeriodDate, cycleLength);
      setResult(data);
    } catch (err) {
      console.error("Ovulation calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleLength, lastPeriodDate]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="ovulation-calculator"
      title="Ovulation Calculator: Figure Out Your Most Fertile Days"
      subtitle="Discover your 6-day fertile window and peak ovulation date to maximize your chances of getting pregnant or track your cycle rhythm."
      badge="Fertility Specialist Reviewed"
      howItWorks={
        <div className="space-y-4">
          <p>
            An ovulation calculator predicts when an egg is released from your ovary (ovulation). In an average 28-day menstrual cycle, ovulation occurs around day 14. However, cycles vary from 21 to 35+ days, and the first part of the cycle (the follicular phase) can fluctuate.
          </p>
          <p>
            The luteal phase — the span between ovulation and your next period — is generally fixed at <strong>14 days</strong> for most women. Therefore, our medical formula calculates your estimated ovulation by subtracting 14 days from your next projected period date:
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50">
            Next Period Date = First Day of Last Period + Cycle Length (days)
            <br />
            Estimated Ovulation Day = Next Period Date - 14 days
            <br />
            Fertile Window = [Ovulation - 5 days, Ovulation + 1 day] (6-day span)
          </div>
          <p>
            <strong>Why is the fertile window 6 days?</strong> Because sperm can survive inside the female reproductive tract for up to 5 days in fertile cervical fluid, while the released egg survives for 12 to 24 hours. The highest probability of conception occurs during the 2 days leading up to ovulation and the day of ovulation itself.
          </p>
        </div>
      }
      faqList={[
        {
          question: "When are my most fertile days?",
          answer:
            "Your most fertile days are the three days leading up to and including ovulation. Having intercourse every 1 to 2 days during your 6-day fertile window ensures viable sperm is present when the egg is released.",
        },
        {
          question: "What physical symptoms indicate I am ovulating?",
          answer:
            "Common symptoms include clear, stretchy, raw-egg-white cervical mucus, mild lower abdominal twinges (mittelschmerz), heightened sexual desire, slight breast sensitivity, and a sustained rise in basal body temperature (BBT) after the egg is released.",
        },
        {
          question: "What if my periods are irregular?",
          answer:
            "If your cycle varies by more than 5 to 7 days from month to month, an ovulation calculator gives an estimate based on your average. To increase precision, pair this calculator with ovulation predictor kits (OPKs which detect the LH surge) or cervical mucus tracking.",
        },
        {
          question: "Can I get pregnant right after my period ends?",
          answer:
            "Yes, if you have a short menstrual cycle (e.g., 21 to 24 days), you may ovulate around cycle day 7 to 10. Because sperm can survive up to 5 days, intercourse near the end of your period could lead to fertilization.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Enter Your Cycle Details</h2>
            <p className="text-xs text-ink/65 mt-0.5">Adjust inputs to instantly recalculate your fertile window.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label htmlFor="lastPeriodDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                First Day of Your Last Period
              </label>
              <input
                id="lastPeriodDate"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Stepper: Cycle Length */}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Calculate Fertile Window"}</span>
            </button>
          </form>

          <div className="rounded-2xl bg-blush/20 p-4 border border-blush/60 text-xs text-ink/75 space-y-1">
            <span className="font-semibold text-berry flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Cycle Length Tip</span>
            </span>
            <p>
              Your cycle length is the number of days from day 1 of bleeding up to (but not including) day 1 of your next period.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ovulation Day Card */}
                <div className="rounded-3xl bg-gradient-to-br from-blush via-white to-peach/40 p-6 border border-peach/70 shadow-sm relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-rose" />
                      <span>Likely Ovulation Date</span>
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-berry">
                      {formatDateDisplay(result.ovulation_date)}
                    </h3>
                    <p className="text-xs text-ink/70">
                      Day {result.cycle_length - 14} of your current cycle.
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-berry shadow-2xs border border-peach/40">
                    <Heart className="h-3.5 w-3.5 text-rose fill-rose" />
                    <span>Peak Egg Release</span>
                  </div>
                </div>

                {/* Fertile Window Card */}
                <div className="rounded-3xl bg-white p-6 border border-peach/70 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>6-Day Fertile Window</span>
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                    {formatDateDisplay(result.fertile_window_start)} – {formatDateDisplay(result.fertile_window_end)}
                  </h3>
                  <p className="text-xs text-ink/70">
                    Best days for conception. Sperm survives up to 5 days.
                  </p>
                  <div className="mt-4 pt-3 border-t border-peach/40 flex justify-between text-xs text-ink/70">
                    <span>Next Period Due:</span>
                    <span className="font-semibold text-ink">{formatDateDisplay(result.next_period_date)}</span>
                  </div>
                </div>
              </div>

              {/* Visual Cycle Calendar */}
              <FloCycleCalendar
                lastPeriodDate={lastPeriodDate}
                periodDuration={5}
                cycleLength={cycleLength}
                monthsToShow={2}
              />

              {/* Fertility Probability Curve */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                    <Clock className="h-4 w-4 text-berry" />
                    <span>Daily Conception Probability Breakdown</span>
                  </h3>
                  <span className="text-xs text-ink/50">Based on clinical studies</span>
                </div>

                <div className="space-y-2.5">
                  {result.fertility_score_by_day.map((dayItem, idx) => {
                    const isPeak = dayItem.score >= 30;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <span className="w-28 shrink-0 font-medium text-ink">
                          {formatShortDate(dayItem.date)}
                        </span>
                        <div className="flex-1 bg-cream rounded-full h-3.5 overflow-hidden border border-peach/40">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPeak ? "bg-gradient-to-r from-rose to-berry" : "bg-peach"
                            }`}
                            style={{ width: `${Math.min(100, dayItem.score * 2.8)}%` }}
                          />
                        </div>
                        <span
                          className={`w-36 shrink-0 text-right font-medium ${
                            isPeak ? "text-berry font-bold" : "text-ink/65"
                          }`}
                        >
                          {dayItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Insights Banner */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Personalized Medical Summary</span>
                </span>
                <p>{result.clinical_note}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
