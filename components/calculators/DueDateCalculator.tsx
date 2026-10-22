"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Baby, CheckCircle2, Sparkles, Info, Heart } from "lucide-react";
import { calculatorsApi, type DueDateResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";

export function DueDateCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [method, setMethod] = useState<"last_period" | "conception">("last_period");
  const [inputDate, setInputDate] = useState(todayStr);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DueDateResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateDueDate(method, inputDate, cycleLength);
      setResult(data);
    } catch (err) {
      console.error("Due date calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [method]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="due-date-calculator"
      title="Pregnancy Due Date Calculator"
      subtitle="Calculate your Estimated Due Date (EDD) and track your baby's journey week by week, from conception to full term birth."
      badge="Obstetric Gold Standard"
      howItWorks={
        <div className="space-y-4">
          <p>
            An estimated due date is calculated using <strong>Naegele&apos;s rule</strong>, which estimates human gestation to last <strong>280 days (40 weeks)</strong> from the first day of your last normal menstrual period (LMP).
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>By Last Period (28-day cycle): Due Date = LMP + 280 days</div>
            <div>Cycle Adjustment: Due Date = LMP + 280 days + (Cycle Length - 28 days)</div>
            <div>By Conception Date: Due Date = Conception Date + 266 days (38 weeks of fetal development)</div>
          </div>
          <p>
            <strong>Note:</strong> Only about 4% to 5% of babies arrive on their exact calculated due date. Most full-term infants are born within a 3-week window between 37 weeks 0 days and 41 weeks 6 days.
          </p>
        </div>
      }
      faqList={[
        {
          question: "How is my due date calculated if my cycle is not 28 days?",
          answer:
            "If your cycle is longer than 28 days (e.g., 32 days), ovulation happens later (around day 18), so 4 days are added to your due date. If your cycle is shorter (e.g., 25 days), ovulation happens earlier, so 3 days are subtracted.",
        },
        {
          question: "Can my doctor change my due date?",
          answer:
            "Yes. If your first-trimester ultrasound measurement (crown-rump length) differs from your menstrual due date by more than 5 to 7 days, your doctor will adjust your official clinical due date to match the ultrasound, as early sonograms are extremely precise.",
        },
        {
          question: "What are the three trimesters?",
          answer:
            "First Trimester: Conception through Week 13. Second Trimester: Week 14 through Week 27. Third Trimester: Week 28 through delivery (Weeks 37–40+).",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Calculation Method</h2>
            <div className="mt-3 flex rounded-2xl border border-peach bg-cream/40 p-1">
              <button
                type="button"
                onClick={() => setMethod("last_period")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  method === "last_period" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                }`}
              >
                Last Period (LMP)
              </button>
              <button
                type="button"
                onClick={() => setMethod("conception")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  method === "conception" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                }`}
              >
                Conception Date
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label htmlFor="inputDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                {method === "last_period" ? "First Day of Last Period" : "Date of Conception / Ovulation"}
              </label>
              <input
                id="inputDate"
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all"
                required
              />
            </div>

            {method === "last_period" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="cycleLen" className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                    Average Cycle Length
                  </label>
                  <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs font-bold text-berry">
                    {cycleLength} days
                  </span>
                </div>
                <input
                  id="cycleLen"
                  type="range"
                  min="20"
                  max="45"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full accent-berry cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Compute Due Date"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Highlight Due Date Card */}
              <div className="rounded-3xl bg-gradient-to-br from-blush via-white to-lavender/40 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-rose" />
                  <span>Estimated Delivery Date (EDD)</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-berry mt-2">
                  {formatDateDisplay(result.estimated_due_date)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  You are currently <strong>{result.gestational_age_weeks} weeks {result.gestational_age_days} days</strong> pregnant (Trimester {result.current_trimester}).
                </p>

                {/* Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink/65">Pregnancy Progress</span>
                    <span className="font-bold text-berry">{result.percentage_progress}%</span>
                  </div>
                  <div className="w-full bg-cream rounded-full h-3 overflow-hidden border border-peach/40">
                    <div
                      className="bg-gradient-to-r from-rose to-berry h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.percentage_progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-ink/50">
                    <span>{result.days_remaining} days remaining until full term</span>
                    <span>40 Weeks</span>
                  </div>
                </div>
              </div>

              {/* Major Milestones Timeline */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-berry" />
                  <span>Your Key Pregnancy Milestones</span>
                </h4>

                <div className="space-y-3">
                  {result.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blush text-[11px] font-bold text-berry">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ink">{m.milestone}</span>
                          <span className="font-bold text-berry">{formatShortDate(m.date)}</span>
                        </div>
                        <p className="text-ink/65">{m.description} ({m.gestational_age})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Guideline */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Obstetrical Context</span>
                </span>
                <p>{result.clinical_guideline}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
