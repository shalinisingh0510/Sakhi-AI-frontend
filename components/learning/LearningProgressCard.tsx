"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learnApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { ArrowRight, Flame, Trophy } from "lucide-react";

interface LearningStats {
  videos_watched: number;
  articles_read: number;
  learning_minutes: number;
  completed_lessons: number;
  streak?: { current: number; longest: number };
}

export function LearningProgressCard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    learnApi.getLearningSummary(token)
      .then((res) => setStats(res as LearningStats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse flex flex-col gap-4">
        <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-slate-100 rounded"></div>
          <div className="h-10 w-24 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const hasActivity = stats.completed_lessons > 0 || stats.learning_minutes > 0 || stats.videos_watched > 0 || stats.articles_read > 0;

  return (
    <Link href="/learn/progress" className="group block mb-8 transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <div className="relative overflow-hidden rounded-2xl border border-berry/20 bg-gradient-to-br from-berry/5 to-rose/5 p-6 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          <div>
            <div className="flex items-center gap-2 text-berry">
              <Trophy size={18} />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider">Your Learning Progress</h2>
            </div>
            
            {hasActivity ? (
              <div className="mt-3 flex items-center gap-4 text-sm font-medium text-ink">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-berry">{stats.videos_watched}</span> videos
                </div>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-berry">{stats.articles_read}</span> articles
                </div>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-berry">{stats.learning_minutes}</span> min
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink/70">
                You haven&apos;t started learning yet. Pick a topic below!
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {(stats.streak?.current ?? 0) > 0 && stats.streak && (
              <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                <Flame size={16} className="fill-orange-500" />
                {stats.streak.current} Day Streak
              </div>
            )}
            
            <div className="flex items-center justify-center rounded-full bg-white p-2 text-berry shadow-sm transition-colors group-hover:bg-berry group-hover:text-white">
              <ArrowRight size={20} />
            </div>
          </div>
          
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-berry/10 blur-2xl"></div>
      </div>
    </Link>
  );
}
