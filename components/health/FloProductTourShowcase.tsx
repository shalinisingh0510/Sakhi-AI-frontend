"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { authApi } from "@/lib/api";
import { normalizeUser } from "@/lib/api-config";
import {
  Sparkles,
  Calendar,
  Heart,
  Baby,
  Activity,
  Zap,
  Apple,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  ChevronRight,
} from "lucide-react";

type FloMode = "cycle" | "pregnancy" | "ttc" | "hormones";

export function FloProductTourShowcase() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { openModal } = useAnonymousModalStore();
  const [activeMode, setActiveMode] = useState<FloMode>("cycle");

  const handleStartAnonymous = async () => {
    try {
      const res = await authApi.createAnonymous();
      const normalized = normalizeUser(res.user);
      login(normalized, res.access_token);
      openModal("shield");
      router.push("/health/cycle");
    } catch (e) {
      console.error("Anonymous start failed:", e);
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-peach/50 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Flo-Grade Health Experience</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Health & Wellness Sanctuary
          </h1>
          <p className="text-sm text-ink/70">
            Preview our clinical tools or start your personalized assessment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartAnonymous}
            className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-all flex items-center gap-1.5"
            title="Start without email"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Track Anonymously 🔒</span>
          </button>
          <Link
            href="/login?redirect=%2Fhealth%2Ftracker"
            className="rounded-2xl border border-peach/80 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-2xs hover:bg-cream transition-all flex items-center gap-1.5"
          >
            <Lock className="h-3.5 w-3.5 text-berry" />
            <span>Sign In to Tracker</span>
          </Link>
          <Link
            href="/onboarding?redirect=%2Fhealth%2Ftracker"
            className="rounded-2xl bg-berry px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center gap-1.5"
          >
            <span>Start Free Assessment 🌸</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Showcase (like Flo product tour) */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-cream via-[#FFF5F7] to-peach/30 p-6 sm:p-10 border border-peach/50 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <button
              type="button"
              onClick={handleStartAnonymous}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Flo Health Anonymous Mode Active · Zero Identifiers</span>
            </button>

            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              One app, with you for <span className="text-berry">every stage</span> of your life.
            </h2>

            <p className="text-base text-ink/75 leading-relaxed max-w-xl">
              Know your body. Own your health. Sakhi AI combines evidence-based clinical algorithms with multi-symptom pattern recognition to give you accurate cycle predictions, fertility windows, and hormone insights.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartAnonymous}
                className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Track Anonymously (No Email) 🔒</span>
              </button>
              <Link
                href="/onboarding?redirect=%2Fhealth%2Ftracker"
                className="rounded-2xl bg-berry px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Begin Assessment</span>
              </Link>
              <Link
                href="/tools"
                className="rounded-2xl border border-peach bg-white/90 px-5 py-3.5 text-sm font-semibold text-ink shadow-2xs hover:bg-white transition-all flex items-center gap-1.5"
              >
                <span>Calculators</span>
                <ChevronRight className="h-4 w-4 text-ink/50" />
              </Link>
            </div>

            {/* Proof Points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-peach/40">
              <div>
                <p className="font-display text-xl font-bold text-berry">100k+</p>
                <p className="text-xs text-ink/65">Women empowered</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-berry">50+</p>
                <p className="text-xs text-ink/65">Symptoms correlated</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-berry">11</p>
                <p className="text-xs text-ink/65">Indian languages</p>
              </div>
            </div>
          </div>

          {/* Interactive Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-peach/60 bg-white/95 p-6 shadow-md backdrop-blur-sm relative">
              <div className="flex items-center justify-between pb-4 border-b border-peach/30">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-berry" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
                    Live Cycle Dial Preview
                  </span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Day 14 · Ovulation
                </span>
              </div>

              {/* Flo Circular Dial Simulation */}
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-8 border-dashed border-berry/30 bg-radial from-blush/40 to-cream shadow-inner">
                  <div className="absolute inset-2 rounded-full border border-berry/20 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-berry/80">
                      Fertile Window
                    </span>
                    <span className="font-display text-3xl font-extrabold text-ink my-1">
                      Day 14
                    </span>
                    <span className="text-xs text-ink/60">
                      Peak Chance of Conception
                    </span>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-berry/10 px-2 py-0.5 text-[10px] font-semibold text-berry">
                      <span>Luteal Phase in 2d</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-cream/70 p-2.5 text-xs">
                    <span className="text-ink/70">Estimated Next Period</span>
                    <span className="font-bold text-ink">In 14 Days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-cream/70 p-2.5 text-xs">
                    <span className="text-ink/70">Cycle Regularity</span>
                    <span className="font-bold text-emerald-600">High Confidence</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/onboarding?redirect=%2Fhealth%2Ftracker"
                  className="block w-full rounded-xl bg-peach/40 py-2.5 text-xs font-bold text-berry hover:bg-peach/60 transition-all text-center"
                >
                  Unlock Your Personal Dial →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flo 4 Modes Showcase (Track Period, Pregnancy, TTC, Hormones) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
            <span>Explore Flo Health Modes</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Customized for every milestone
          </h2>
          <p className="mt-1 text-sm text-ink/70">
            Switch modes as your goals change. Sakhi AI adapts its algorithms to match your biological journey.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-cream/60 rounded-2xl border border-peach/50 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveMode("cycle")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "cycle"
                ? "bg-berry text-white shadow-xs"
                : "text-ink/70 hover:bg-white/80"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Track Cycle</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("ttc")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "ttc"
                ? "bg-berry text-white shadow-xs"
                : "text-ink/70 hover:bg-white/80"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Trying to Conceive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("pregnancy")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "pregnancy"
                ? "bg-berry text-white shadow-xs"
                : "text-ink/70 hover:bg-white/80"
            }`}
          >
            <Baby className="h-3.5 w-3.5" />
            <span>Pregnancy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("hormones")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "hormones"
                ? "bg-berry text-white shadow-xs"
                : "text-ink/70 hover:bg-white/80"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Hormones & Mood</span>
          </button>
        </div>

        {/* Dynamic Mode Card Display */}
        <div className="rounded-3xl border border-peach/70 bg-white p-6 sm:p-8 shadow-xs">
          {activeMode === "cycle" && (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-berry/10 px-3 py-1 text-xs font-bold text-berry">
                  Mode 1 · Menstrual Intelligence
                </span>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Never be caught off-guard by your period again
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Log your flow intensity, cramps, and spotting. Our clinical prediction model adjusts cycle length dynamically based on your previous 12 cycles, even if your cycle is irregular.
                </p>
                <ul className="space-y-2 text-xs text-ink/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Smart countdown to next period and PMS window</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Identifies subtle luteal and follicular phase changes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Full cycle history with exportable medical reports</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/onboarding?redirect=%2Fhealth%2Ftracker"
                    className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white hover:bg-berry/90 transition-all"
                  >
                    <span>Start Cycle Tracking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-peach/40 bg-[#FFFBFB] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Cycle Rhythm Forecast</span>
                  <span className="text-berry">Phase 2: Follicular</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-white p-2.5 border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Menstruation</p>
                    <p className="font-bold text-rose-600 mt-1">Days 1–5</p>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-peach/30 border-berry/40 shadow-xs">
                    <p className="text-[10px] text-berry uppercase font-semibold">Follicular</p>
                    <p className="font-bold text-berry mt-1">Days 6–13</p>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Ovulation</p>
                    <p className="font-bold text-emerald-600 mt-1">Day 14</p>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Luteal</p>
                    <p className="font-bold text-purple-600 mt-1">Days 15–28</p>
                  </div>
                </div>
                <div className="rounded-xl bg-peach/20 p-3 text-xs text-ink/80 flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-berry shrink-0" />
                  <span>Energy peak expected on Day 12 due to natural estrogen surge.</span>
                </div>
              </div>
            </div>
          )}

          {activeMode === "ttc" && (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Mode 2 · Fertility & Conception
                </span>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Maximize your chances of conceiving naturally
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Pinpoint your 6-day fertile window with clinical precision. Track basal body temperature (BBT), cervical fluid changes, and ovulation test strips to time conception perfectly.
                </p>
                <ul className="space-y-2 text-xs text-ink/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Conception probability indicator for every single day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Ovulation day confirmation and luteal phase sufficiency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Evidence-based conception diet and lifestyle recommendations</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/onboarding?redirect=%2Fhealth%2Ftracker"
                    className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white hover:bg-berry/90 transition-all"
                  >
                    <span>Start Conception Mode</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-peach/40 bg-[#F6FAF8] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Conception Window</span>
                  <span className="text-emerald-700">Days 10–15</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                    <span>Peak Day (Ovulation)</span>
                    <span className="font-bold text-emerald-600">32% Conception Chance</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                    <span>1 Day Before</span>
                    <span className="font-bold text-emerald-600">30% Conception Chance</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                    <span>Cervical Mucus Quality</span>
                    <span className="font-bold text-emerald-700">Egg White (Peak)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === "pregnancy" && (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Mode 3 · Pregnancy Journey
                </span>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Week-by-week baby growth and body changes
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Follow your pregnancy week by week with delightful fruit and vegetable size comparisons, trimester milestones, contraction timers, and daily medical guidance.
                </p>
                <ul className="space-y-2 text-xs text-ink/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Due date calculator based on ultrasound or last period</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Trimester symptom manager (nausea, heartburn, fatigue)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Baby kick counter & birth preparation checklists</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/onboarding?redirect=%2Fhealth%2Ftracker"
                    className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white hover:bg-berry/90 transition-all"
                  >
                    <span>Track Pregnancy</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/60 bg-[#FFFDF7] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Week 18 of 40</span>
                  <span className="text-amber-700 font-semibold">2nd Trimester</span>
                </div>
                <div className="rounded-xl bg-white p-4 border border-amber-100 text-center">
                  <span className="text-3xl" aria-hidden="true">🥑</span>
                  <p className="font-display font-bold text-ink mt-2">Size of a Bell Pepper</p>
                  <p className="text-xs text-ink/60">Length: 14 cm · Weight: 190 g</p>
                </div>
                <p className="text-xs text-amber-900/80 bg-amber-50 p-2.5 rounded-xl border border-amber-200/50">
                  Baby can now hear sounds! You may begin feeling subtle flutters or quickening this week.
                </p>
              </div>
            </div>
          )}

          {activeMode === "hormones" && (
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                  Mode 4 · Hormones & Energy Intelligence
                </span>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Understand what your hormones are doing every single day
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Your body undergoes natural fluctuations in estrogen, progesterone, and testosterone each month. Connect the dots between your hormonal cycles and your daily energy, mood, and sleep.
                </p>
                <ul className="space-y-2 text-xs text-ink/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Predict pre-menstrual mood dips 48h before they occur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Understand food cravings and metabolic shifts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Practical tips to alleviate hormonal acne and headaches</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/onboarding?redirect=%2Fhealth%2Ftracker"
                    className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white hover:bg-berry/90 transition-all"
                  >
                    <span>Analyze My Hormones</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-200/60 bg-[#FAF7FC] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Hormone Curve Status</span>
                  <span className="text-purple-700">Luteal Phase</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">Progesterone</p>
                      <p className="text-[10px] text-ink/50">Peaks to support uterine lining</p>
                    </div>
                    <span className="font-bold text-purple-700">Rising ▲</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">Estrogen</p>
                      <p className="text-[10px] text-ink/50">Secondary modest increase</p>
                    </div>
                    <span className="font-bold text-ink/70">Moderate</span>
                  </div>
                </div>
                <p className="text-[11px] text-purple-900/80 bg-purple-50 p-2.5 rounded-xl border border-purple-200/50">
                  Tip: Increase magnesium intake (spinach, pumpkin seeds) to calm the nervous system and relieve PMS.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Banners Grid (Activity, Energy, Nutrition, Symptoms) */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">
            Integrated Wellness Ecosystem
          </h2>
          <p className="text-sm text-ink/70">
            Everything your body experiences connects. Track every dimension of your health under one private roof.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Activity Tracker Banner */}
          <div className="group rounded-3xl border border-peach/70 bg-linear-to-b from-white to-cream/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-peach/40 text-berry">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-berry transition-colors">
                Activity Tracker
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed">
                Sync workouts to your cycle phases. Push for strength during follicular phase and enjoy restorative walking when menstruating.
              </p>
            </div>
            <Link
              href="/onboarding?redirect=%2Fhealth%2Factivity"
              className="mt-4 flex items-center justify-between border-t border-peach/30 pt-3 text-xs font-semibold text-berry hover:underline"
            >
              <span>Explore Activity Sync</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Energy & Mood Tracker Banner */}
          <div className="group rounded-3xl border border-peach/70 bg-linear-to-b from-white to-cream/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-berry transition-colors">
                Energy & Mood Tracker
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed">
                Log daily vitality levels and emotional shifts. Discover patterns between hormone changes and mental stamina.
              </p>
            </div>
            <Link
              href="/onboarding?redirect=%2Fhealth%2Fcheck-in"
              className="mt-4 flex items-center justify-between border-t border-peach/30 pt-3 text-xs font-semibold text-berry hover:underline"
            >
              <span>Start Daily Check-in</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Nutrition & Craving Banner */}
          <div className="group rounded-3xl border border-peach/70 bg-linear-to-b from-white to-cream/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Apple className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-berry transition-colors">
                Nutrition & Metabolism
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed">
                Calibrated to Indian and global diets. Track iron, protein, and hydration with tips for cramp relief and energy replenishment.
              </p>
            </div>
            <Link
              href="/onboarding?redirect=%2Fhealth%2Fnutrition"
              className="mt-4 flex items-center justify-between border-t border-peach/30 pt-3 text-xs font-semibold text-berry hover:underline"
            >
              <span>View Nutrition Hub</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Symptoms Logger Banner */}
          <div className="group rounded-3xl border border-peach/70 bg-linear-to-b from-white to-cream/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-ink group-hover:text-berry transition-colors">
                50+ Symptom Logger
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed">
                Record cramps, headaches, bloating, acne, breast tenderness, and insomnia to uncover recurring cyclical patterns.
              </p>
            </div>
            <Link
              href="/onboarding?redirect=%2Fhealth%2Fsymptoms"
              className="mt-4 flex items-center justify-between border-t border-peach/30 pt-3 text-xs font-semibold text-berry hover:underline"
            >
              <span>Explore Symptoms</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clinical Privacy Commitment */}
      <section className="rounded-3xl border border-peach/60 bg-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-berry uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Medical-Grade Privacy Commitment</span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Your health data stays strictly yours. Always.
            </h3>
            <p className="text-xs text-ink/75 leading-relaxed">
              We never sell reproductive health information to third-party data brokers or advertisers. All logs are encrypted with AES-256 and private by default.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/onboarding?redirect=%2Fhealth%2Ftracker"
              className="rounded-2xl bg-berry px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-berry/90 transition-all text-center"
            >
              Start Free Today 🌸
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
