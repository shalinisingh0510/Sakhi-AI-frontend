"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Compass, Info } from "lucide-react";
import { calculatorsApi, type MenstrualCycleResult } from "@/lib/calculators-api";
import { CalculatorLayout } from "./CalculatorLayout";
import { FloStepper, FloCycleCalendar } from "./FloCalculatorWidgets";

export function MenstrualCycleCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [lastPeriodDate, setLastPeriodDate] = useState(todayStr);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MenstrualCycleResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculatorsApi.calculateMenstrualCycle(lastPeriodDate, periodDuration, cycleLength);
      setResult(data);
    } catch (err) {
      console.error("Menstrual cycle calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPeriodDate, periodDuration, cycleLength]);

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <CalculatorLayout
      currentSlug="menstrual-cycle-calculator"
      title="Menstrual Cycle Calculator: 4 Phases & Hormone Rhythm"
      subtitle="Understand what happens inside your body throughout your entire cycle — explore the menstrual, follicular, ovulatory, and luteal phases."
      badge="Comprehensive Cycle Syncing"
      howItWorks={
        <div className="space-y-4">
          <p>
            The menstrual cycle is a finely coordinated endocrine rhythm regulated by the hypothalamic-pituitary-ovarian (HPO) axis. It is divided into four distinct biological phases:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>1. Menstrual Phase (Days 1–5):</strong> The functional layer of the endometrium sheds as estrogen and progesterone fall to basal levels.
            </li>
            <li>
              <strong>2. Follicular Phase (Days 1–13):</strong> Follicle-Stimulating Hormone (FSH) prompts several ovarian follicles to develop. As dominant follicles mature, estradiol (estrogen) rises, rebuilding the uterine lining and boosting physical stamina.
            </li>
            <li>
              <strong>3. Ovulation Phase (~Day 14):</strong> A dramatic Luteinizing Hormone (LH) surge causes the dominant follicle to rupture, releasing a mature oocyte into the fallopian tube.
            </li>
            <li>
              <strong>4. Luteal Phase (Days 15–28):</strong> The ruptured follicle transforms into the corpus luteum, which synthesizes progesterone. Progesterone stabilizes the uterine lining for potential implantation. If pregnancy does not occur, the corpus luteum degrades, triggering the next menses.
            </li>
          </ul>
        </div>
      }
      faqList={[
        {
          question: "How long is a healthy menstrual cycle?",
          answer:
            "A medically normal adult menstrual cycle ranges from 21 to 35 days (counted from day 1 of bleeding to day 1 of the next period). In teenagers, cycles can normally range from 21 to 45 days as hormonal axes mature.",
        },
        {
          question: "What is cycle syncing?",
          answer:
            "Cycle syncing is the practice of aligning your nutrition, fitness routines, work productivity, and sleep habits with the natural hormonal fluctuations of your 4 cycle phases to optimize energy and reduce PMS symptoms.",
        },
        {
          question: "Why do I feel more tired before my period?",
          answer:
            "In the late luteal phase (the days before your period), both estrogen and progesterone experience a steep drop. Progesterone is also naturally sedating, and fluctuating serotonin levels during this window can lead to lower energy and food cravings.",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 shadow-sm space-y-6">
          <div className="border-b border-peach/40 pb-4">
            <h2 className="font-display text-lg font-bold text-ink">Cycle Parameters</h2>
            <p className="text-xs text-ink/65 mt-0.5">Customize your cycle length and bleeding duration using steppers.</p>
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

            {/* Flo Stepper: Bleeding Duration */}
            <FloStepper
              id="periodDur"
              label="Bleeding Duration"
              value={periodDuration}
              min={2}
              max={10}
              unit="days"
              onChange={(val) => setPeriodDuration(val)}
              helperText="Typical: 4 to 7 days"
            />

            {/* Flo Stepper: Cycle Length */}
            <FloStepper
              id="cycleLen"
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
              <Calendar className="h-4 w-4" />
              <span>{loading ? "Calculating..." : "Map My 4 Cycle Phases"}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="space-y-6">
              {/* Summary Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-5 border border-peach/70 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-berry">Next Period</span>
                  <p className="font-display text-xl font-bold text-ink">
                    {formatDateDisplay(result.next_period_start)} – {formatDateDisplay(result.next_period_end)}
                  </p>
                  <p className="text-xs text-ink/65">{periodDuration} days duration</p>
                </div>
                <div className="rounded-3xl bg-white p-5 border border-peach/70 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Next Ovulation</span>
                  <p className="font-display text-xl font-bold text-ink">
                    {formatDateDisplay(result.ovulation_date)}
                  </p>
                  <p className="text-xs text-ink/65">Peak fertility day</p>
                </div>
              </div>

              {/* Flo Cycle Calendar Visualizer */}
              <FloCycleCalendar
                lastPeriodDate={lastPeriodDate}
                periodDuration={periodDuration}
                cycleLength={cycleLength}
                monthsToShow={2}
              />

              {/* 4 Phases Detailed Accordions */}
              <div className="space-y-4">
                <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <Compass className="h-4 w-4 text-berry" />
                  <span>The 4 Phases of Your Menstrual Rhythm</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-white p-5 border border-peach/60 shadow-2xs space-y-3 hover:border-berry/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-bold text-berry">
                            {formatDateDisplay(phase.start_date)} - {formatDateDisplay(phase.end_date)}
                          </span>
                          <span className="text-xs text-ink/40 font-medium">{phase.duration_days} days</span>
                        </div>
                        <h4 className="font-display text-base font-bold text-ink">{phase.name}</h4>
                        <p className="text-xs text-ink/65 leading-relaxed">{phase.hormone_focus}</p>

                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-semibold text-berry block">Energy &amp; Focus:</span>
                          <p className="text-xs text-ink/75">{phase.energy_level}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-peach/40 text-[11px] text-ink/70">
                        <span className="font-semibold text-emerald-700">Wellness Tip: </span>
                        {phase.wellness_tips}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regularity Guidance */}
              <div className="rounded-2xl bg-white p-5 border border-peach/60 text-xs text-ink/75 leading-relaxed space-y-2">
                <span className="font-semibold text-ink flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4 text-berry" />
                  <span>Cycle Regularity Note</span>
                </span>
                <p>{result.cycle_regularity_info}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
