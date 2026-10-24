"use client";

import React, { useState, useEffect } from "react";
import { Activity, Clock, TrendingUp, CheckCircle2, Info, ArrowUpRight } from "lucide-react";
import { calculatorsApi, type HcgResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloHcgDoublingGauge } from "./FloCalculatorWidgets";

export function HcgCalculator() {
  const [firstLevel, setFirstLevel] = useState<number>(120);
  const [secondLevel, setSecondLevel] = useState<number>(290);
  const [timeBetween, setTimeBetween] = useState<number>(2);
  const [timeUnit, setTimeUnit] = useState<"days" | "hours">("days");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HcgResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (firstLevel <= 0 || secondLevel <= 0 || timeBetween <= 0) return;
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateHcg(firstLevel, secondLevel, timeBetween, timeUnit);
      setResult(data);
    } catch (err) {
      console.error("hCG calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLevel, secondLevel, timeBetween, timeUnit]);

  return (
    <CalculatorLayout
      currentSlug="hcg-calculator"
      title="Beta hCG Doubling Time Calculator & Charts"
      subtitle="Track quantitative serum hCG levels across consecutive blood draws to compute doubling rate and expected percentage increase in early pregnancy."
      badge="Clinical Lab Tool"
      howItWorks={
        <div className="space-y-4">
          <p>
            Human Chorionic Gonadotropin (hCG) is synthesized by the syncytiotrophoblast cells of the early placenta shortly after implantation. In early viable pregnancies with hCG levels under 6,000 mIU/mL, concentration typically doubles every <strong>48 to 72 hours</strong>.
          </p>
          <p>
            The mathematical formula used to calculate hCG doubling time ($T_d$) is derived from the exponential growth equation:
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>Doubling Time (hours) = Δt / log₂(hCG₂ / hCG₁)</div>
            <div>Where: Δt = elapsed time in hours between draws, hCG₁ = initial draw, hCG₂ = second draw</div>
            <div>24-Hour Increase (%) = 100 × (2^(24 / T_d) - 1)</div>
            <div>48-Hour Increase (%) = 100 × (2^(48 / T_d) - 1)</div>
          </div>
          <p>
            <strong>Clinical Context on hCG Trends:</strong> A rising hCG level confirms metabolic activity of early trophoblastic tissue. As hCG levels exceed 1,200 to 2,000 mIU/mL, transvaginal ultrasound can typically identify a gestational sac. Once hCG exceeds 6,000 mIU/mL, doubling naturally slows to 96+ hours.
          </p>
        </div>
      }
      faqList={[
        {
          question: "What is a normal hCG doubling time?",
          answer:
            "In early pregnancy (below 1,200 mIU/mL), doubling every 48 to 72 hours is typical. Between 1,200 and 6,000 mIU/mL, doubling normally slows to 72–96 hours, and above 6,000 mIU/mL it often exceeds 96 hours.",
        },
        {
          question: "What does it mean if my hCG doubling time is slow?",
          answer:
            "A doubling time slower than 72 hours in very early pregnancy warrants clinical evaluation by your doctor. It may indicate an ectopic pregnancy, an early pregnancy loss (blighted ovum or chemical pregnancy), or normal biological variation.",
        },
        {
          question: "Can hCG levels decrease in a healthy pregnancy?",
          answer:
            "hCG levels peak between 8 and 11 weeks of pregnancy (often reaching 100,000 to 200,000+ mIU/mL) before naturally declining and plateauing for the remainder of pregnancy. However, in the first 4 to 7 weeks, decreasing levels usually signify an unviable pregnancy.",
        },
        {
          question: "Does a high hCG level indicate twins or multiples?",
          answer:
            "While pregnancies with multiples frequently exhibit higher baseline hCG levels, a single blood test cannot diagnose twins. Only an ultrasound can confirm multiple gestational sacs or fetal heartbeats.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Enter Two Blood Draws</h2>
            <p className="text-xs text-ink/65 mt-0.5">Quantitative serum β-hCG from laboratory results.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label htmlFor="firstHcg" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                First β-hCG Level (mIU/mL)
              </label>
              <input
                id="firstHcg"
                type="number"
                min="1"
                step="0.1"
                value={firstLevel}
                onChange={(e) => setFirstLevel(Number(e.target.value))}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            <div>
              <label htmlFor="secondHcg" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Second β-hCG Level (mIU/mL)
              </label>
              <input
                id="secondHcg"
                type="number"
                min="1"
                step="0.1"
                value={secondLevel}
                onChange={(e) => setSecondLevel(Number(e.target.value))}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            <div>
              <label htmlFor="timeBetween" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Time Between Tests
              </label>
              <div className="flex gap-2">
                <input
                  id="timeBetween"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={timeBetween}
                  onChange={(e) => setTimeBetween(Number(e.target.value))}
                  className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                  required
                />
                <div className="flex rounded-2xl border border-peach bg-cream/30 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTimeUnit("days")}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                      timeUnit === "days" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeUnit("hours")}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                      timeUnit === "hours" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    Hours
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Activity className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Compute Doubling Time"}</span>
            </button>
          </form>

          <div className="rounded-2xl bg-blush/20 p-4 border border-blush/60 text-xs text-ink/75 space-y-1">
            <span className="font-semibold text-berry flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Testing Tip</span>
            </span>
            <p>
              Ideally, repeat blood tests should be drawn at the exact same laboratory to avoid inter-assay variability.
            </p>
          </div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Primary Doubling Metric Card */}
              <div className="rounded-3xl bg-gradient-to-br from-lavender/60 via-white to-blush/40 p-6 border border-peach/70 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-berry" />
                    <span>hCG Doubling Time</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      result.doubling_time_hours && result.doubling_time_hours <= 72
                        ? "bg-mint text-moss"
                        : "bg-peach text-berry"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-3">
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
                    {result.doubling_time_hours ? `${result.doubling_time_hours} hours` : "N/A"}
                  </h3>
                  {result.doubling_time_days && (
                    <span className="text-sm font-medium text-ink/65">
                      ({result.doubling_time_days} days)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-peach/50">
                  <div>
                    <span className="text-xs text-ink/65 flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-moss" />
                      <span>24-Hour Increase</span>
                    </span>
                    <span className="text-lg font-bold text-ink">
                      +{result.increase_24h_percent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-ink/65 flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-moss" />
                      <span>48-Hour Increase</span>
                    </span>
                    <span className="text-lg font-bold text-ink">
                      +{result.increase_48h_percent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Flo hCG Doubling Gauge */}
              {result.doubling_time_hours !== null && (
                <FloHcgDoublingGauge
                  doublingTimeHours={result.doubling_time_hours}
                  twoDayIncreasePercent={result.increase_48h_percent}
                />
              )}

              {/* Clinical Interpretation */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-3">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-moss" />
                  <span>Clinical Evaluation</span>
                </h4>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  {result.clinical_interpretation}
                </p>
              </div>

              {/* Standard Gestational hCG Reference Table */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-berry" />
                  <span>Early Pregnancy hCG Reference Ranges</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-peach/60 text-ink/50 uppercase tracking-wider text-[10px]">
                        <th className="pb-2 font-semibold">Gestational Age</th>
                        <th className="pb-2 font-semibold">Typical Serum Range</th>
                        <th className="pb-2 font-semibold">Expected Doubling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-peach/30 text-ink/80">
                      {result.chart_reference.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cream/40 transition-colors">
                          <td className="py-2.5 font-medium text-ink">{row.gestational_weeks}</td>
                          <td className="py-2.5">{row.typical_hCG_range}</td>
                          <td className="py-2.5 text-berry font-medium">{row.expected_doubling}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
