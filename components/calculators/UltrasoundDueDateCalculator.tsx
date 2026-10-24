"use client";

import React, { useState, useEffect } from "react";
import { ScanLine, CheckCircle2, Info, Sparkles } from "lucide-react";
import { calculatorsApi, type UltrasoundDueDateResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper, FloTrimesterBar } from "./FloCalculatorWidgets";

export function UltrasoundDueDateCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [ultrasoundDate, setUltrasoundDate] = useState(todayStr);
  const [weeks, setWeeks] = useState(10);
  const [days, setDays] = useState(0);
  const [crlMm, setCrlMm] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UltrasoundDueDateResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateUltrasoundDueDate(ultrasoundDate, weeks, days, crlMm);
      setResult(data);
    } catch (err) {
      console.error("Ultrasound due date calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultrasoundDate, weeks, days, crlMm]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="due-date-by-ultrasound"
      title="Due Date Calculator by Ultrasound"
      subtitle="Estimate your clinical delivery date and current gestational age based on early sonogram biometry and crown-rump length (CRL)."
      badge="ACOG Committee Standard"
      howItWorks={
        <div className="space-y-4">
          <p>
            An early ultrasound scan measures fetal biometry — most notably the <strong>Crown-Rump Length (CRL)</strong> in the first trimester, or biparietal diameter (BPD) and femur length (FL) later on.
          </p>
          <div className="rounded-2xl bg-cream p-4 font-mono text-xs text-ink/80 border border-peach/50 space-y-1">
            <div>Gestational Days at Scan = (Scan Weeks × 7) + Scan Days</div>
            <div>Due Date = Scan Date + (280 days - Gestational Days at Scan)</div>
            <div>Current Gestational Age Today = Gestational Days at Scan + (Today - Scan Date)</div>
          </div>
          <p>
            First-trimester ultrasound (performed up to 13 weeks 6 days) is considered the most accurate method to date a pregnancy, with a margin of error of just ±3 to 5 days.
          </p>
        </div>
      }
      faqList={[
        {
          question: "When does an ultrasound due date replace my period due date?",
          answer:
            "According to the American College of Obstetricians and Gynecologists (ACOG), if an ultrasound performed before 8 weeks 6 days differs from LMP dating by more than 5 days, or before 13 weeks 6 days differs by more than 7 days, the ultrasound due date becomes the official clinical due date.",
        },
        {
          question: "What is Crown-Rump Length (CRL)?",
          answer:
            "Crown-Rump Length (CRL) is the measurement from the top of the embryo's head (crown) to the bottom of the buttocks (rump), excluding limbs. It is measured in millimeters and correlates directly with gestational age in the first trimester.",
        },
        {
          question: "Can my ultrasound due date change in the third trimester?",
          answer:
            "No. Guidelines strictly discourage redating a pregnancy in the second or third trimester if an accurate first-trimester ultrasound was already performed. Later scans measure fetal growth and weight rather than gestational age.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Ultrasound Scan Details</h2>
            <p className="text-xs text-ink/65 mt-0.5">Enter findings from your sonography report.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label htmlFor="scanDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Date Ultrasound Was Performed
              </label>
              <input
                id="scanDate"
                type="date"
                value={ultrasoundDate}
                onChange={(e) => setUltrasoundDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
                required
              />
            </div>

            {/* Flo Stepper: Gestational Age Weeks at Scan */}
            <FloStepper
              id="scanWeeks"
              label="Gestational Age at Scan (Weeks)"
              value={weeks}
              min={1}
              max={40}
              unit="weeks"
              onChange={(val) => setWeeks(val)}
              helperText="Recorded on ultrasound sheet"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Additional Days at Scan (0 - 6)
              </label>
              <div className="grid grid-cols-7 gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                      days === d
                        ? "bg-berry text-white shadow-xs"
                        : "bg-cream/60 border border-peach text-ink/70 hover:bg-blush/40"
                    }`}
                  >
                    +{d}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="crlMm" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Crown-Rump Length (Optional, mm)
              </label>
              <input
                id="crlMm"
                type="number"
                min="1"
                max="90"
                step="0.1"
                placeholder="e.g. 32.5 mm"
                value={crlMm ?? ""}
                onChange={(e) => setCrlMm(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <ScanLine className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Compute Ultrasound Due Date"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Primary Highlight Card */}
              <div className="rounded-3xl bg-gradient-to-br from-mint/60 via-white to-lavender/40 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ultrasound Estimated Due Date (EDD)</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-2">
                  {formatDateDisplay(result.estimated_due_date)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  Adjusted for your scan on {new Date(ultrasoundDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}.
                </p>

                <div className="mt-6 pt-4 border-t border-peach/50 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-ink/60 block">Age Today:</span>
                    <span className="font-bold text-berry">
                      {result.current_gestational_age_weeks}w {result.current_gestational_age_days}d
                    </span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Days Remaining:</span>
                    <span className="font-semibold text-ink">{result.days_remaining} days</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Est. Conception:</span>
                    <span className="font-semibold text-ink">
                      {new Date(result.estimated_conception_date + "T00:00:00").toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flo Trimester Bar */}
              <FloTrimesterBar
                currentWeek={result.current_gestational_age_weeks}
                currentDay={result.current_gestational_age_days}
                totalDaysRemaining={result.days_remaining}
                dueDate={result.estimated_due_date}
              />

              {/* ACOG Redating Guidelines Card */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-3">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-berry" />
                  <span>ACOG Committee Opinion No. 700 Criteria</span>
                </h4>
                <p className="text-xs text-ink/75 leading-relaxed">
                  {result.acog_redating_criteria}
                </p>
              </div>

              {/* Scan Insights */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Clinical Summary</span>
                </span>
                <p>{result.scan_insights}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
