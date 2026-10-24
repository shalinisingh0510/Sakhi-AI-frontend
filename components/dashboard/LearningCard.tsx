"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type LearningSummary } from "@/lib/api";
import { ArrowRight, PlayCircle, BookOpen, CheckCircle } from "lucide-react";

export function LearningCard({ data }: { data: LearningSummary | null }) {
  const locale = useLocale();
  const isHi = locale === "hi";

  const getLocalizedHref = (path: string) => {
    return locale === "en" ? path : `/${locale}${path}`;
  };

  if (!data) {
    return (
      <Card padding="lg" className="flex h-full flex-col bg-white">
        <h2 className="font-display text-xl font-bold text-ink mb-2">
          {isHi ? "आपकी शिक्षा" : "Your Learning"}
        </h2>
        <p className="text-sm text-ink/70 mb-6">
          {isHi ? "अपने स्वास्थ्य के बारे में सीखते रहें" : "Keep learning about your health"}
        </p>
        <div className="flex-1 flex flex-col justify-center gap-4 animate-pulse">
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
          <div className="h-24 w-full rounded-2xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  const { videos_watched, articles_read, learning_minutes, completed_lessons, continue_learning } = data;
  
  // Empty State
  if (completed_lessons === 0 && !continue_learning) {
    return (
      <Card padding="lg" className="flex h-full flex-col bg-white border-berry/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <BookOpen size={120} />
        </div>
        
        <div className="mb-6 relative z-10">
          <h2 className="font-display text-2xl font-bold text-ink">
            {isHi ? "आपकी शिक्षा" : "Your Learning"}
          </h2>
          <p className="text-sm text-ink/70">
            {isHi ? "महिला स्वास्थ्य शिक्षा की शुरुआत करें।" : "Start exploring women's health education."}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 text-center">
          <div className="h-16 w-16 bg-lavender/30 rounded-full flex items-center justify-center mb-4 text-berry">
            <PlayCircle size={32} />
          </div>
          <p className="text-ink font-semibold mb-2">
            {isHi ? "अपनी यात्रा शुरू करें" : "Begin your journey"}
          </p>
          <p className="text-sm text-ink/60 max-w-[200px] mx-auto">
            {isHi ? "विशेष रूप से तैयार वीडियो, लेख और गाइड देखें।" : "Explore videos, articles, and guides tailored for you."}
          </p>
        </div>

        <Link href={getLocalizedHref("/learn")} className="mt-auto block relative z-10">
          <Button className="w-full flex items-center justify-center gap-2">
            {isHi ? "सीखें एक्सप्लोर करें" : "Explore Learn"} <ArrowRight size={16} />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="flex h-full flex-col bg-white border-berry/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <BookOpen size={120} />
      </div>
      
      <div className="mb-6 relative z-10">
        <h2 className="font-display text-2xl font-bold text-ink">
          {isHi ? "आपकी शिक्षा" : "Your Learning"}
        </h2>
        <p className="text-sm text-ink/70">
          {isHi ? "अपने स्वास्थ्य के बारे में सीखते रहें 🌸" : "Keep learning about your health 🌸"}
        </p>
      </div>

      <div className="flex flex-col gap-4 flex-1 relative z-10 mb-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-berry">{videos_watched}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink/50 mt-1">
              {isHi ? "वीडियो" : "Videos"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-berry">{articles_read}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink/50 mt-1">
              {isHi ? "लेख" : "Articles"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-berry">{learning_minutes}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink/50 mt-1">
              {isHi ? "मिनट" : "Minutes"}
            </p>
          </div>
        </div>

        {/* Completed Indicator */}
        <div className="flex items-center gap-2 px-2">
          <CheckCircle className="text-moss w-4 h-4" />
          <span className="text-sm font-medium text-ink/80">
            {isHi ? `${completed_lessons} पाठ पूरे किए गए` : `${completed_lessons} lessons completed`}
          </span>
        </div>

        {/* Continue Learning */}
        {continue_learning ? (
          <div className="mt-2 bg-lavender/10 rounded-2xl p-4 border border-lavender/30">
            <p className="text-xs font-semibold text-berry uppercase tracking-wide mb-2">
              {isHi ? "सीखना जारी रखें" : "Continue learning"}
            </p>
            <p className="text-sm font-bold text-ink truncate mb-3">{continue_learning.title}</p>
            <Link href={getLocalizedHref(`/learn/${continue_learning.id}`)}>
              <Button size="sm" className="w-full flex items-center justify-center gap-2">
                {isHi ? "जारी रखें" : "Continue"} <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-2 bg-lavender/10 rounded-2xl p-4 border border-lavender/30 text-center">
            <p className="text-sm font-medium text-ink mb-3">
              {isHi ? "अगले पाठ के लिए तैयार हैं?" : "Ready for your next lesson?"}
            </p>
            <Link href={getLocalizedHref("/learn")}>
              <Button size="sm" variant="secondary" className="w-full flex items-center justify-center gap-2 bg-white">
                {isHi ? "सीखें एक्सप्लोर करें" : "Explore Learn"} <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
