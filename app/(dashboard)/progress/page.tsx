"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

const MODULE_EMOJIS = ["🌿", "🩸"];

const BADGE_EMOJIS = ["🌸", "🔥", "💧"];

export default function ProgressPage() {
  const t = useTranslations("Progress");
  const stats = t.raw("stats") as { label: string; emoji: string }[];
  const modules = t.raw("modules") as { title: string; pct: number }[];
  const badges = t.raw("badges") as { label: string; desc: string }[];
  const demo = t.raw("demoValues") as { streak: number; modulesCompleted: number; totalPoints: number };

  const statValues = [demo.streak, demo.modulesCompleted, demo.totalPoints];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mb-8 text-sm text-ink/60">{t("subtitle")}</p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} padding="sm" className="text-center">
            <p className="text-2xl">{s.emoji}</p>
            <p className="mt-1 font-display text-2xl font-bold text-berry">{statValues[i]}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </Card>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-ink">{t("moduleProgressTitle")}</h2>
        <div className="flex flex-col gap-3">
          {modules.map((m, i) => (
            <Card key={m.title} padding="sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{MODULE_EMOJIS[i] ?? "📖"}</span>
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

      <section>
        <h2 className="mb-4 text-base font-semibold text-ink">{t("badgesTitle")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {badges.map((b, i) => (
            <Card key={b.label} padding="sm" className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center">
              <span className="text-3xl">{BADGE_EMOJIS[i]}</span>
              <div>
                <p className="text-sm font-semibold text-ink">{b.label}</p>
                <p className="text-xs text-ink/50">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
