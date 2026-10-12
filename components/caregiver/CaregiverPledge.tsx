"use client";

import Link from "next/link";
import { Heart, Bot, Compass } from "lucide-react";

export function CaregiverPledge() {
  return (
    <div className="mb-10 rounded-3xl border border-[#EDE2E7] bg-gradient-to-br from-[#FFFDFE] via-[#FCF4F8] to-[#F7EAF2] p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-berry/10 text-berry mb-4">
        <Heart size={22} fill="currentColor" />
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        Our Caregiver Pledge
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
        No question is shameful, no stage is trivial. Together, we are building a generation of girls who grow up with bodily autonomy, pride, and unwavering peace of mind.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#3F1F36] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-98"
        >
          <Bot size={15} />
          <span>Launch AI Sakhi Companion</span>
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
        >
          <Compass size={15} />
          <span>Explore All Health Topics</span>
        </Link>
      </div>
    </div>
  );
}
