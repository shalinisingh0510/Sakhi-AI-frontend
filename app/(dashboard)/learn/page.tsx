"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

const MODULES = [
  {
    slug: "menstrual-health",
    emoji: "🩸",
    title: "Menstrual Health",
    desc: "Understand your cycle, manage symptoms, and feel confident.",
    lessons: 6,
    duration: "18 min",
    progress: 33,
    color: "from-rose/10 to-blush",
    border: "border-rose/20",
  },
  {
    slug: "puberty-basics",
    emoji: "🌸",
    title: "Puberty Basics",
    desc: "Learn about the physical and emotional changes of puberty.",
    lessons: 5,
    duration: "15 min",
    progress: 0,
    color: "from-lavender to-lavender/40",
    border: "border-berry/20",
  },
  {
    slug: "personal-hygiene",
    emoji: "🌿",
    title: "Personal Hygiene",
    desc: "Simple daily habits to stay clean, healthy, and confident.",
    lessons: 4,
    duration: "12 min",
    progress: 100,
    color: "from-mint to-mint/40",
    border: "border-moss/20",
  },
  {
    slug: "mental-wellbeing",
    emoji: "🧘",
    title: "Mental Wellbeing",
    desc: "Manage emotions, stress, and build positive self-esteem.",
    lessons: 7,
    duration: "22 min",
    progress: 0,
    color: "from-peach to-peach/40",
    border: "border-rose/20",
  },
  {
    slug: "nutrition-health",
    emoji: "🥗",
    title: "Nutrition & Health",
    desc: "Iron, calcium, and the nutrients your body needs to thrive.",
    lessons: 5,
    duration: "16 min",
    progress: 0,
    color: "from-mint/60 to-lavender/40",
    border: "border-moss/20",
  },
  {
    slug: "safety-consent",
    emoji: "🛡️",
    title: "Safety & Consent",
    desc: "Know your rights, understand consent, and stay safe.",
    lessons: 6,
    duration: "20 min",
    progress: 0,
    color: "from-blush to-peach/40",
    border: "border-berry/20",
  },
];

export default function LearnPage() {
  const completed = MODULES.filter((m) => m.progress === 100).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Learn with Sakhi 📖</h1>
        <p className="mt-1 text-sm text-ink/60">
          {completed} of {MODULES.length} modules completed · At your own pace, always.
        </p>
        {/* Overall progress */}
        <div className="mt-4 h-2 w-full rounded-full bg-peach/60">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-700"
            style={{ width: `${(completed / MODULES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => (
          <Link key={mod.slug} href={`/learn/${mod.slug}`}>
            <Card
              padding="sm"
              className={[
                "group h-full flex flex-col bg-gradient-to-br border transition-all duration-200 hover:shadow-soft hover:-translate-y-1",
                mod.color,
                mod.border,
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-sm">
                  {mod.emoji}
                </span>
                {mod.progress === 100 && (
                  <span className="rounded-full bg-moss/20 px-2 py-0.5 text-xs font-semibold text-moss">
                    ✓ Done
                  </span>
                )}
                {mod.progress > 0 && mod.progress < 100 && (
                  <span className="rounded-full bg-berry/10 px-2 py-0.5 text-xs font-semibold text-berry">
                    In progress
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-ink">{mod.title}</h2>
              <p className="mt-1 text-xs text-ink/60 flex-1">{mod.desc}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
                <span>{mod.lessons} lessons · {mod.duration}</span>
                <span className="text-berry font-medium group-hover:translate-x-1 transition-transform">→</span>
              </div>

              {mod.progress > 0 && (
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/50">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-rose to-berry"
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
