"use client";

import React, { useState, useEffect } from "react";
import { HeartPulse, Clock, Sparkles, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { calculatorsApi, type ImplantationResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";

export function ImplantationCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [method, setMethod] = useState<"od" | "lp">("od");
  const [inputDate, setInputDate] = useState(todayStr);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImplantationResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateImplantation(method, inputDate, cycleLength);
      setResult(data);
    } catch (err) {
      console.error("Implantation calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [method]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="implantation-calculator"
      title="Implantation Calculator: When Does Implantation Occur?"
      subtitle="Calculate the exact timeframe when a fertilized blastocyst attaches to your uterine lining and discover key early symptoms."
      badge="Early Pregnancy Biology"
      howItWorks={
        <div className="space-y-4">
          <p>
            Implantation occurs when a developing blastocyst (approximately 5 to 6 days after fertilization) embeds into the receptive endometrium of the uterus.
          </p>
          <p>
            In human reproduction, implantation occurs between <strong>6 and 10 days post-ovulation (DPO)</strong>, with <strong>8 to 9 DPO</strong> representing the statistical peak:
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>Ovulation Day (Conception) = Day 0</div>
            <div>Implantation Window = 6 to 10 Days Post-Ovulation</div>
            <div>Peak Implantation Frequency = 8 to 9 DPO (84% of viable pregnancies implant between 8-10 DPO)</div>
            <div>Earliest Urine Pregnancy Test = 14 DPO (4-5 days after implantation completes)</div>
          </div>
          <p>
            Once implantation takes place, the nascent placenta starts secreting human Chorionic Gonadotropin (hCG) into the bloodstream, triggering the physiological cascade of pregnancy.
          </p>
        </div>
      }
      faqList={[
        {
          question: "What does implantation bleeding look like?",
          answer:
            "Implantation bleeding is typically very light spotting (pink or rust-brown droplets), without clots, and lasts from a few hours up to 2 days. It occurs about a week before your expected period and does not fill a pad or tampon.",
        },
        {
          question: "How do I tell implantation cramps from period cramps?",
          answer:
            "Implantation cramps are usually described as mild pricking, pulling, or tingling sensations in the lower abdomen or lower back. They are significantly milder and shorter-lived than standard menstrual cramps.",
        },
        {
          question: "Does every pregnant person experience implantation symptoms?",
          answer:
            "No. Only about 25% to 30% of women notice light spotting or cramping during implantation. A complete absence of symptoms is completely normal and has no bearing on pregnancy viability.",
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
                onClick={() => setMethod("od")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  method === "od" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                }`}
              >
                By Ovulation Date
              </button>
              <button
                type="button"
                onClick={() => setMethod("lp")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                  method === "lp" ? "bg-berry text-white shadow-xs" : "text-ink/70 hover:text-ink"
                }`}
              >
                By Last Period
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label htmlFor="inputDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                {method === "od" ? "Date of Ovulation" : "First Day of Last Period"}
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

            {method === "lp" && (
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
              <HeartPulse className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Compute Implantation Window"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Highlight Implantation Window Card */}
              <div className="rounded-3xl bg-gradient-to-br from-blush/80 via-white to-lavender/40 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-rose" />
                  <span>Expected Implantation Window</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-berry mt-2">
                  {formatDateDisplay(result.implantation_window_start)} – {formatDateDisplay(result.implantation_window_end)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  6 to 10 days post-ovulation. Peak attachment occurs around{" "}
                  <strong>{formatDateDisplay(result.peak_implantation_date)}</strong>.
                </p>

                <div className="mt-6 pt-4 border-t border-peach/50 flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-ink/60 block">Estimated Ovulation Date:</span>
                    <span className="font-semibold text-ink">{formatDateDisplay(result.ovulation_date)}</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Earliest Reliable Urine Test:</span>
                    <span className="font-semibold text-moss">
                      {formatDateDisplay(result.earliest_pregnancy_test_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptoms Guide */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-berry" />
                  <span>Recognizing Early Implantation Signs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {result.symptoms_guide.map((sym, idx) => (
                    <div key={idx} className="rounded-2xl bg-cream/50 p-3.5 border border-peach/40 space-y-1">
                      <span className="font-bold text-berry flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-moss" />
                        <span>{sym.symptom}</span>
                      </span>
                      <p className="text-ink/70 leading-relaxed">{sym.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Note */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Physiological Summary</span>
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
