"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Props {
  params: { slug: string };
}

const MODULE_DATA: Record<
  string,
  {
    emoji: string;
    title: string;
    desc: string;
    lessons: { id: number; title: string; duration: string; done: boolean }[];
  }
> = {
  "menstrual-health": {
    emoji: "🩸",
    title: "Menstrual Health",
    desc: "Understand your cycle, manage symptoms, and feel confident every month.",
    lessons: [
      { id: 1, title: "What is the menstrual cycle?", duration: "3 min", done: true },
      { id: 2, title: "The 4 phases of your cycle", duration: "4 min", done: true },
      { id: 3, title: "Why do cramps happen?", duration: "3 min", done: false },
      { id: 4, title: "Choosing the right period product", duration: "4 min", done: false },
      { id: 5, title: "Tracking your period", duration: "3 min", done: false },
      { id: 6, title: "When to see a doctor", duration: "2 min", done: false },
    ],
  },
  "personal-hygiene": {
    emoji: "🌿",
    title: "Personal Hygiene",
    desc: "Simple daily habits to stay clean, healthy, and confident.",
    lessons: [
      { id: 1, title: "Daily hygiene basics", duration: "3 min", done: true },
      { id: 2, title: "Period hygiene tips", duration: "3 min", done: true },
      { id: 3, title: "Skin and hair care", duration: "3 min", done: true },
      { id: 4, title: "Building a hygiene routine", duration: "3 min", done: true },
    ],
  },
};

const DEFAULT_MODULE = {
  emoji: "📖",
  title: "Health Module",
  desc: "Learn about this important health topic at your own pace.",
  lessons: [
    { id: 1, title: "Introduction", duration: "3 min", done: false },
    { id: 2, title: "Key concepts", duration: "4 min", done: false },
    { id: 3, title: "Practical tips", duration: "3 min", done: false },
    { id: 4, title: "Quiz", duration: "2 min", done: false },
  ],
};

export default function ModulePage({ params }: Props) {
  const mod = MODULE_DATA[params.slug] ?? DEFAULT_MODULE;
  const completed = mod.lessons.filter((l) => l.done).length;
  const pct = Math.round((completed / mod.lessons.length) * 100);
  const nextLesson = mod.lessons.find((l) => !l.done);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      {/* Back */}
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1 text-sm text-berry hover:underline">
        ← Back to modules
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="text-5xl">{mod.emoji}</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">{mod.title}</h1>
        <p className="mt-2 text-sm text-ink/60">{mod.desc}</p>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-peach/60">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink/60">{pct}%</span>
        </div>
        <p className="mt-1 text-xs text-ink/50">{completed} of {mod.lessons.length} lessons completed</p>
      </div>

      {/* Continue CTA */}
      {nextLesson && (
        <Card className="mb-6 bg-gradient-to-br from-blush/60 to-lavender/40 border-berry/20">
          <p className="text-xs font-semibold text-berry uppercase tracking-wider mb-1">Continue learning</p>
          <p className="font-semibold text-ink">{nextLesson.title}</p>
          <Button className="mt-3" size="sm">
            Start lesson · {nextLesson.duration}
          </Button>
        </Card>
      )}

      {/* Lesson list */}
      <div className="flex flex-col gap-3">
        {mod.lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className={[
              "flex items-center gap-4 rounded-2xl border p-4 transition-all",
              lesson.done
                ? "border-moss/30 bg-mint/30"
                : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/20 cursor-pointer",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                lesson.done
                  ? "bg-moss/20 text-moss"
                  : "bg-peach/60 text-ink/60",
              ].join(" ")}
            >
              {lesson.done ? "✓" : i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${lesson.done ? "text-moss" : "text-ink"}`}>
                {lesson.title}
              </p>
              <p className="text-xs text-ink/50">{lesson.duration}</p>
            </div>
            {!lesson.done && (
              <span className="text-berry text-sm">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
