"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningSummary } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Play, FileText, TrendingUp, ShieldCheck, Clock } from "lucide-react";

export function ContinueJourneySection() {
  const { token } = useAuthStore();
  const [summary, setSummary] = useState<LearningSummary | null>(null);

  useEffect(() => {
    if (!token) return;
    learningApi.getSummary(token)
      .then((res) => setSummary(res as unknown as LearningSummary))
      .catch(() => {});
  }, [token]);

  // Fallback defaults matching Stitch screen if user hasn't started yet
  const content = summary?.continue_learning;
  const progressPercent = summary ? 60 : 45;

  const title = content?.title || "Demystifying the Menstrual Cycle: Hormones Made Simple";
  const description = content?.description || "Learn how estrogen and progesterone choreograph your energy, mood shifts, and sleep patterns throughout each month.";
  const href = content ? `/learn/${content.id}` : "/learn/paths/mastering-menstrual-health";
  const thumbnail = content?.thumbnail_url || "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Card: Continue Your Journey */}
        <div className="flex flex-col lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-berry text-white">
                <Play size={10} fill="currentColor" />
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Continue Your Journey
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              1 Active Module in Progress
            </span>
          </div>

          <div className="group flex flex-1 flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-sm transition-all hover:border-berry/30 hover:shadow-md gap-5">
            {/* Left Thumbnail */}
            <div className="relative aspect-[4/3] sm:w-44 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
                <span>🎙</span>
                <span>Voice-Guided</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-md bg-berry/10 px-2.5 py-0.5 text-[11px] font-bold text-berry">
                    Module 2 of 4 • Follicular Phase
                  </span>
                  <span className="text-xs font-semibold text-berry">
                    {progressPercent}% completed
                  </span>
                </div>

                <Link href={href}>
                  <h3 className="font-display text-base font-bold text-ink leading-snug transition-colors hover:text-berry line-clamp-2">
                    {title}
                  </h3>
                </Link>

                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="mt-4">
                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mb-2">
                  <div
                    className="h-full rounded-full bg-berry transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> 4 min remaining
                  </span>
                  <span>Next: Luteal Phase Insights</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F1F36] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-[0.98]"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Resume Learning</span>
                  </Link>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
                  >
                    <FileText size={12} />
                    <span>Read Notes</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Weekly Rhythm / Hormone Tracker Insight */}
        <div className="flex flex-col lg:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <TrendingUp size={14} className="text-berry" />
              <span>WEEKLY RHYTHM</span>
            </div>
            <span className="text-[11px] font-medium text-berry">
              Cycle Day 8 of 28
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-gradient-to-br from-[#FFFDFE] to-[#FDF4F8] p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-ink">
                  Follicular Glow
                </h3>
                <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-[10px] font-bold text-moss">
                  Peak Clarity
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Your estrogen is naturally rising. This is optimal for learning new concepts, strength workouts, and creative problem-solving.
              </p>

              {/* Cycle Wave Visualizer */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-white/90 p-3 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Day 1</span>
                  <span className="text-berry font-bold">Day 8 (Today)</span>
                  <span>Day 14</span>
                  <span>Day 28</span>
                </div>

                {/* SVG Curve */}
                <div className="relative h-12 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 300 48" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#D86A8E" stopOpacity="0.4" />
                        <stop offset="35%" stopColor="#7B3E73" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#7B3E73" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#D86A8E" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    {/* Sine curve */}
                    <path
                      d="M 0,38 Q 45,40 75,24 T 150,8 T 225,28 T 300,42"
                      fill="none"
                      stroke="url(#curveGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Active Day 8 marker */}
                    <circle cx="85" cy="22" r="5" fill="#7B3E73" />
                    <circle cx="85" cy="22" r="9" fill="#7B3E73" fillOpacity="0.25" className="animate-ping" />
                  </svg>
                </div>

                {/* 4 Phases row */}
                <div className="mt-1.5 flex justify-between text-[9px] font-semibold text-slate-400">
                  <span className="text-slate-400">Period</span>
                  <span className="text-berry font-bold">Follicular</span>
                  <span className="text-slate-400">Ovulation</span>
                  <span className="text-slate-400">Luteal</span>
                </div>
              </div>
            </div>

            {/* Doctor Verification Seal */}
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
              <ShieldCheck size={14} className="text-moss shrink-0" />
              <span>Clinically reviewed by <strong className="text-slate-700">Dr. Radhika Sen, OB-GYN</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
