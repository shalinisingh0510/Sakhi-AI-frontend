"use client";

import { Card } from "@/components/ui/Card";

const COMPLETED_MODULES = [
  { emoji: "🌿", title: "Personal Hygiene", pct: 100 },
  { emoji: "🩸", title: "Menstrual Health", pct: 33 },
];

const BADGES = [
  { emoji: "🌸", label: "First Step", desc: "Completed your first lesson" },
  { emoji: "🔥", label: "On Fire", desc: "3-day learning streak" },
  { emoji: "💧", label: "Hygiene Hero", desc: "Finished Hygiene module" },
];

export default function ProgressPage() {
  const streak = 3;
  const totalPoints = 120;
  const modulesCompleted = 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold text-ink mb-2">My Progress 📊</h1>
      <p className="text-sm text-ink/60 mb-8">Keep going — every lesson counts!</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { value: `${streak}`, label: "Day streak", emoji: "🔥" },
          { value: `${modulesCompleted}`, label: "Modules done", emoji: "📖" },
          { value: `${totalPoints}`, label: "Points", emoji: "⭐" },
        ].map((s) => (
          <Card key={s.label} padding="sm" className="text-center">
            <p className="text-2xl">{s.emoji}</p>
            <p className="font-display text-2xl font-bold text-berry mt-1">{s.value}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Modules progress */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-ink mb-4">Module Progress</h2>
        <div className="flex flex-col gap-3">
          {COMPLETED_MODULES.map((m) => (
            <Card key={m.title} padding="sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-sm font-medium text-ink">{m.title}</span>
                </div>
                <span className="text-xs font-semibold text-berry">{m.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-peach/60">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-700"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-base font-semibold text-ink mb-4">Badges Earned 🏅</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {BADGES.map((b) => (
            <Card key={b.label} padding="sm" className="flex items-center gap-3 sm:flex-col sm:text-center sm:items-center">
              <span className="text-3xl">{b.emoji}</span>
              <div>
                <p className="font-semibold text-ink text-sm">{b.label}</p>
                <p className="text-xs text-ink/50">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
