"use client";

import React, { useState, useEffect } from "react";
import { Baby, CheckCircle2 } from "lucide-react";
import { calculatorsApi, type WeeksToMonthsResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper, FloTrimesterBar } from "./FloCalculatorWidgets";

export function PregnancyWeeksToMonthsCalculator() {
  const [weeks, setWeeks] = useState(16);
  const [days, setDays] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeeksToMonthsResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateWeeksToMonths(weeks, days);
      setResult(data);
    } catch (err) {
      console.error("Weeks to months calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks, days]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="pregnancy-weeks-to-months-calculator"
      title="Pregnancy Weeks to Months Calculator: How Far Along Are You?"
      subtitle="Convert gestational weeks into medical pregnancy months and trimesters, track fetal size comparisons, and follow key developmental milestones."
      badge="Pregnancy Tracking"
      howItWorks={
        <div className="space-y-4">
          <p>
            Pregnancy is calculated medically in <strong>weeks</strong> (40 full weeks or 280 days from the first day of your last menstrual period). However, friends, family, and everyday calendars count pregnancy in <strong>9 calendar months</strong>.
          </p>
          <p>
            Because a calendar month averages 4.3 weeks (rather than an exact 4 weeks), months and weeks don&apos;t align uniformly. The medical standard followed by Sakhi AI and obstetricians maps weeks to months as follows:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono bg-cream p-4 rounded-2xl border border-peach/50">
            <div>
              <span className="font-bold text-berry block">First Trimester:</span>
              Month 1: Weeks 1–4<br />
              Month 2: Weeks 5–8<br />
              Month 3: Weeks 9–13
            </div>
            <div>
              <span className="font-bold text-berry block">Second Trimester:</span>
              Month 4: Weeks 14–17<br />
              Month 5: Weeks 18–22<br />
              Month 6: Weeks 23–27
            </div>
            <div>
              <span className="font-bold text-berry block">Third Trimester:</span>
              Month 7: Weeks 28–31<br />
              Month 8: Weeks 32–35<br />
              Month 9: Weeks 36–40+
            </div>
          </div>
        </div>
      }
      faqList={[
        {
          question: "Why does a 9-month pregnancy equal 40 weeks?",
          answer:
            "40 weeks equals 280 days. If you divide 280 days by the average length of a calendar month (30.4 days), pregnancy actually lasts approximately 9 months and 1 week. Furthermore, the first two weeks of pregnancy occur before conception even takes place (dating from your last menstrual period).",
        },
        {
          question: "When does the second trimester officially begin?",
          answer:
            "The second trimester begins at Week 14. This is often called the 'golden trimester' as morning sickness and first-trimester exhaustion typically ease, and fetal movements ('quickening') become noticeable.",
        },
        {
          question: "When is a pregnancy considered full term?",
          answer:
            "A baby is considered 'early term' at 37 weeks, 'full term' from 39 weeks 0 days to 40 weeks 6 days, and 'late term' at 41 weeks. Delivery between 39 and 41 weeks provides the best outcomes for neonatal lung and brain maturity.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Current Gestational Age</h2>
            <p className="text-xs text-ink/65 mt-0.5">Use the stepper or slider to choose your exact week and days.</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Stepper: Pregnancy Weeks */}
            <FloStepper
              id="weeksSelect"
              label="Pregnancy Weeks"
              value={weeks}
              min={1}
              max={42}
              unit="weeks"
              onChange={(val) => setWeeks(val)}
              helperText="From 1 to 42 weeks"
            />

            <div>
              <label htmlFor="daysSelect" className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                Additional Days (0 - 6)
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-berry py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 focus:outline-none focus:ring-2 focus:ring-berry focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Baby className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Update Progress"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Highlight Month & Trimester Card */}
              <div className="rounded-3xl bg-gradient-to-br from-peach/50 via-white to-blush/60 p-6 sm:p-8 border border-peach/70 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                    <Baby className="h-4 w-4 text-berry" />
                    <span>Current Stage</span>
                  </span>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-berry border border-peach/50">
                    {result.trimester_name}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
                    Month {result.current_month}
                  </h3>
                  <span className="text-sm font-medium text-ink/65">
                    ({result.weeks} weeks {result.days} days)
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-peach/50 flex items-center justify-between text-xs">
                  <span className="text-ink/70">Estimated Due Date:</span>
                  <span className="font-bold text-ink">{formatDateDisplay(result.estimated_due_date)}</span>
                </div>
              </div>

              {/* Trimester Bar with Fruit Milestone */}
              <FloTrimesterBar
                currentWeek={result.weeks}
                currentDay={result.days}
                dueDate={result.estimated_due_date}
              />

              {/* Fetal Milestones for this Month */}
              <div className="rounded-3xl bg-white p-6 border border-peach/60 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-berry" />
                  <span>Key Month {result.current_month} Milestones</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {result.fetal_development_milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-2xl bg-cream/50 p-3 border border-peach/40">
                      <div className="h-2 w-2 rounded-full bg-berry shrink-0" />
                      <span className="font-medium text-ink/80">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
