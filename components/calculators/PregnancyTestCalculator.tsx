"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, Info } from "lucide-react";
import { calculatorsApi, type PregnancyTestResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper } from "./FloCalculatorWidgets";

export function PregnancyTestCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [method, setMethod] = useState<"last_period" | "ovulation">("last_period");
  const [inputDate, setInputDate] = useState(todayStr);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PregnancyTestResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculatePregnancyTest(method, inputDate, cycleLength);
      setResult(data);
    } catch (err) {
      console.error("Pregnancy test calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [method, inputDate, cycleLength]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="pregnancy-test-calculator"
      title="Pregnancy Test Calculator: When to Take a Test"
      subtitle="Find out the most accurate date to take an at-home urine pregnancy test to avoid false negatives and understand your testing timeline."
      badge="Accuracy Focused"
      howItWorks={
        <div className="space-y-4">
          <p>
            Home pregnancy tests detect human Chorionic Gonadotropin (hCG) in urine. Following fertilization, the embryo travels down the fallopian tube and implants into the uterine lining <strong>6 to 10 days post-ovulation</strong>.
          </p>
          <p>
            hCG only begins entering the maternal bloodstream after implantation is complete, and it takes an additional 2 to 3 days to filter into urine in quantities detectable by standard home tests (typically 25 mIU/mL).
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>Optimal Test Date (99% Accuracy) = Day of Missed Period (or 14 Days Post-Ovulation)</div>
            <div>Early Detection Test Date (50-65% Accuracy) = 4-5 Days Before Missed Period (10 DPO)</div>
          </div>
          <p>
            Testing earlier than 10 DPO has a high false negative rate because hCG concentration in urine may still be below 10-25 mIU/mL, even if fertilization occurred.
          </p>
        </div>
      }
      faqList={[
        {
          question: "Can I test before my missed period?",
          answer:
            "Some high-sensitivity 'early detection' tests claim accuracy up to 5 or 6 days before your missed period (around 9–10 DPO). However, accuracy on those days is typically around 50–65%. Waiting until the day of your missed period raises accuracy to over 99%.",
        },
        {
          question: "Does the time of day I test matter?",
          answer:
            "Yes! First-morning urine contains the highest concentration of hCG because your urine hasn't been diluted by liquids consumed throughout the day. If testing later in the day, avoid drinking large amounts of water for 3 to 4 hours before testing.",
        },
        {
          question: "What does a faint second line mean?",
          answer:
            "A faint line in the test window is usually a positive result, indicating that hCG was detected. Repeat the test 48 hours later with first-morning urine to see if the line darkens as your hCG doubles.",
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
                onClick={() => setMethod("ovulation")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  method === "ovulation" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                }`}
              >
                Ovulation Date
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label htmlFor="inputDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                {method === "last_period" ? "First Day of Last Period" : "Date of Ovulation or Unprotected Sex"}
              </label>
              <input
                id="inputDate"
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            {method === "last_period" && (
              <FloStepper
                id="cycleLen"
                label="Average Cycle Length"
                value={cycleLength}
                min={20}
                max={45}
                unit="days"
                onChange={(val) => setCycleLength(val)}
                helperText="Standard cycle is 28 days"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Find Best Test Date"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Primary Recommended Date Card */}
              <div className="rounded-3xl bg-gradient-to-br from-mint/50 via-white to-peach/30 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Recommended Test Date (99%+ Accuracy)</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-2">
                  {formatDateDisplay(result.recommended_test_date)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  {result.days_until_recommended_test > 0
                    ? `That's in ${result.days_until_recommended_test} days. Testing on this day yields peak clinical accuracy.`
                    : "You are currently past your expected test date. A home pregnancy test today will be highly reliable."}
                </p>

                <div className="mt-6 pt-4 border-t border-peach/50 flex flex-wrap gap-6 text-xs">
                  <div>
                    <span className="text-ink/60 block">Early Test Date:</span>
                    <span className="font-semibold text-ink">
                      {new Date(result.early_test_date + "T00:00:00").toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Days Past Ovulation (DPO):</span>
                    <span className="font-semibold text-ink">{result.days_past_ovulation} DPO</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Current Accuracy:</span>
                    <span className="font-semibold text-berry">{result.test_accuracy_today}</span>
                  </div>
                </div>
              </div>

              {/* Biological Timeline */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <Clock className="h-4 w-4 text-berry" />
                  <span>Biological Conception to Test Timeline</span>
                </h4>

                <div className="space-y-3">
                  {result.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blush text-xs font-bold text-berry">
                        {step.dpo}d
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ink">{step.stage}</span>
                          <span className="text-[11px] text-ink/50">
                            {new Date(step.date + "T00:00:00").toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-ink/65">{step.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidance */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Clinical Advice</span>
                </span>
                <p>{result.clinical_guidance}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
