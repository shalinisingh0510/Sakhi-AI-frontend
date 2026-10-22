"use client";

import React, { useState, useEffect } from "react";
import { Microscope, Clock, CheckCircle2, Info, Sparkles, Heart } from "lucide-react";
import { calculatorsApi, type IvfDueDateResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";

export function IvfDueDateCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [transferDate, setTransferDate] = useState(todayStr);
  const [transferType, setTransferType] = useState<"tr-1" | "tr-2" | "tr-3" | "tr-4">("tr-2");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IvfDueDateResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateIvfDueDate(transferDate, transferType);
      setResult(data);
    } catch (err) {
      console.error("IVF due date calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [transferType]);

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
      currentSlug="ivf-due-date-calculator"
      title="IVF and FET Due Date Calculator"
      subtitle="Calculate your precise estimated due date after in vitro fertilization (IVF), frozen embryo transfer (FET), or donor egg procedures."
      badge="Reproductive Endocrinology"
      howItWorks={
        <div className="space-y-4">
          <p>
            In unassisted conception, gestational age is estimated from the last menstrual period because the exact date of conception is uncertain. In IVF, the exact date of fertilization and embryo development stage are known with absolute precision.
          </p>
          <p>
            Obstetric formulas calculate an IVF due date by adding days directly to the transfer date:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-cream p-4 rounded-2xl border border-peach/50">
            <div>
              <strong>Day 3 Embryo Transfer:</strong>
              <br />
              Due Date = Transfer Date + 263 days
              <br />
              Theoretical LMP = Transfer Date - 17 days
            </div>
            <div>
              <strong>Day 5 Blastocyst Transfer:</strong>
              <br />
              Due Date = Transfer Date + 261 days
              <br />
              Theoretical LMP = Transfer Date - 19 days
            </div>
            <div>
              <strong>Day 6 Blastocyst Transfer:</strong>
              <br />
              Due Date = Transfer Date + 260 days
              <br />
              Theoretical LMP = Transfer Date - 20 days
            </div>
            <div>
              <strong>Egg Retrieval / IUI:</strong>
              <br />
              Due Date = Retrieval Date + 266 days
              <br />
              Theoretical LMP = Retrieval Date - 14 days
            </div>
          </div>
        </div>
      }
      faqList={[
        {
          question: "Why is an IVF due date more accurate than natural conception?",
          answer:
            "Because the embryologist observes the exact moment of fertilization and culture, gestational age is not dependent on irregular menstrual cycles, delayed ovulation, or variable follicular phase lengths.",
        },
        {
          question: "How is frozen embryo transfer (FET) calculated differently from fresh IVF?",
          answer:
            "Fresh and frozen transfers of the same embryo stage (e.g., Day 5 blastocyst) share the exact same calculation. The date the embryo is thawed and transferred into the uterus is used as the transfer date.",
        },
        {
          question: "When should I take my beta hCG blood test after an embryo transfer?",
          answer:
            "Clinics typically schedule the first quantitative serum beta hCG test 9 to 11 days after a Day 5 blastocyst transfer, or 12 to 14 days after a Day 3 transfer.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Transfer Information</h2>
            <p className="text-xs text-ink/65 mt-0.5">Select your embryo stage and transfer date.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label htmlFor="transferDate" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Date of Transfer or Retrieval
              </label>
              <input
                id="transferDate"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="transferType" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Embryo Transfer Type
              </label>
              <select
                id="transferType"
                value={transferType}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-2.5 text-sm text-ink font-medium focus:border-berry focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry/20 transition-all"
              >
                <option value="tr-2">Day 5 Blastocyst Transfer (Most Common)</option>
                <option value="tr-1">Day 3 Embryo Transfer (Cleavage Stage)</option>
                <option value="tr-4">Day 6 Blastocyst Transfer</option>
                <option value="tr-3">Egg Retrieval Date / IUI (Day 0)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Microscope className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Compute IVF Due Date"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Primary Highlight Card */}
              <div className="rounded-3xl bg-gradient-to-br from-lavender/60 via-white to-blush/40 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-berry" />
                  <span>IVF Estimated Due Date</span>
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-berry mt-2">
                  {formatDateDisplay(result.estimated_due_date)}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 mt-1">
                  Based on your <strong>{result.transfer_type_label}</strong>. You are currently{" "}
                  <strong>{result.gestational_age_weeks} weeks {result.gestational_age_days} days</strong> pregnant.
                </p>

                <div className="mt-6 pt-4 border-t border-peach/50 flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-ink/60 block">Theoretical LMP:</span>
                    <span className="font-semibold text-ink">{formatShortDate(result.theoretical_lmp)}</span>
                  </div>
                  <div>
                    <span className="text-ink/60 block">Days to Delivery:</span>
                    <span className="font-semibold text-moss">{result.days_remaining} days</span>
                  </div>
                </div>
              </div>

              {/* ART & IVF Clinical Milestones */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-berry" />
                  <span>Early IVF Clinical Milestones</span>
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

              {/* Clinical Context */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Clinical Assurance</span>
                </span>
                <p>{result.clinical_explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
