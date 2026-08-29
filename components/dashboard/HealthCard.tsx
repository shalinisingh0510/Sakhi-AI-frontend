"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type WellnessDashboardResponse } from "@/lib/api";
import { ArrowRight, Droplets, Zap, Smile } from "lucide-react";

export function HealthCard({ data }: { data: WellnessDashboardResponse | null }) {
  if (!data) {
    return (
      <Card padding="lg" className="flex h-full flex-col bg-white">
        <h2 className="font-display text-xl font-bold text-ink mb-2">Your Health Today</h2>
        <p className="text-sm text-ink/70 mb-6">A quick snapshot of how you&apos;re doing.</p>
        <div className="flex-1 flex flex-col justify-center gap-4 animate-pulse">
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  // Period Status
  const cycleDay = data.cycle.cycle_day;
  let periodText = "Period data unavailable";
  let periodSub = "Start tracking your cycle";

  if (cycleDay !== null && cycleDay !== undefined) {
    periodText = `Day ${cycleDay}`;
    if (data.cycle.next_period) {
      const nextDate = new Date(data.cycle.next_period);
      const today = new Date();
      // Ensure we compare midnight to midnight in local time
      today.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        periodSub = "Next period expected today";
      } else if (diffDays < 0) {
        periodSub = `Next period is ${Math.abs(diffDays)} days late`;
      } else {
        periodSub = `Next period in ~${diffDays} days`;
      }
    } else {
      periodSub = "Next period unknown";
    }
  }

  // Energy
  const energy = data.today.energy;
  const energyText = energy ? `Energy: ${energy}` : "Energy: Not logged today";

  // Mood
  const mood = data.today.mood;
  const moodText = mood ? `Mood: ${mood}` : "Mood: Not logged today";

  return (
    <Card padding="lg" className="flex h-full flex-col bg-white border-rose/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Droplets size={120} />
      </div>
      
      <div className="mb-6 relative z-10">
        <h2 className="font-display text-2xl font-bold text-ink">Your Health Today</h2>
        <p className="text-sm text-ink/70">A quick snapshot of how you&apos;re doing</p>
      </div>

      <div className="flex flex-col gap-3 flex-1 relative z-10 mb-6">
        {/* Period Block */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose/5 border border-rose/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/20 text-rose">
            <Droplets size={20} />
          </div>
          <div>
            <p className="font-bold text-ink">{periodText}</p>
            <p className="text-xs text-ink/60">{periodSub}</p>
          </div>
        </div>

        {/* Energy Block */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-peach/10 border border-peach/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach/30 text-peach-dark">
            <Zap size={20} />
          </div>
          <div>
            <p className="font-bold text-ink">{energyText}</p>
          </div>
        </div>

        {/* Mood Block */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-lavender/20 border border-lavender/40">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender/50 text-berry">
            <Smile size={20} />
          </div>
          <div>
            <p className="font-bold text-ink">{moodText}</p>
          </div>
        </div>
      </div>

      <Link href="/health" className="mt-auto block relative z-10">
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
          View Health <ArrowRight size={16} />
        </Button>
      </Link>
    </Card>
  );
}
