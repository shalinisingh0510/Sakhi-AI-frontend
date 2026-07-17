"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const MODULE_EMOJIS: Record<string, string> = {
  "menstrual-health": "🩸",
  "personal-hygiene": "🌿",
};

type Lesson = {
  id: number;
  title: string;
  duration: string;
  done: boolean;
};

type ModuleData = {
  title: string;
  desc: string;
  lessons: Lesson[];
};

export default function ModulePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const t = useTranslations("LearnDetail");

  const modules = t.raw("modules") as Record<string, ModuleData>;
  const defaultLessons = t.raw("defaultLessons") as Lesson[];

  const mod = modules[slug] ?? {
    title: t("defaultTitle"),
    desc: t("defaultDesc"),
    lessons: defaultLessons,
  };

  const emoji = MODULE_EMOJIS[slug] ?? "📖";
  const completed = mod.lessons.filter((l) => l.done).length;
  const pct = Math.round((completed / mod.lessons.length) * 100);
  const nextLesson = mod.lessons.find((l) => !l.done);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1 text-sm text-berry hover:underline">
        {t("backToModules")}
      </Link>

      <div className="mb-8">
        <span className="text-5xl">{emoji}</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">{mod.title}</h1>
        <p className="mt-2 text-sm text-ink/60">{mod.desc}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-peach/60">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink/60">{pct}%</span>
        </div>
        <p className="mt-1 text-xs text-ink/50">
          {t("lessonsCompleted", { completed, total: mod.lessons.length })}
        </p>
      </div>

      {nextLesson && (
        <Card className="mb-6 border-berry/20 bg-gradient-to-br from-blush/60 to-lavender/40">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-berry">{t("continueLearning")}</p>
          <p className="font-semibold text-ink">{nextLesson.title}</p>
          <Button className="mt-3" size="sm">
            {t("startLesson", { duration: nextLesson.duration })}
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {mod.lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className={[
              "flex items-center gap-4 rounded-2xl border p-4 transition-all",
              lesson.done
                ? "border-moss/30 bg-mint/30"
                : "cursor-pointer border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/20",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                lesson.done ? "bg-moss/20 text-moss" : "bg-peach/60 text-ink/60",
              ].join(" ")}
            >
              {lesson.done ? "✓" : i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${lesson.done ? "text-moss" : "text-ink"}`}>{lesson.title}</p>
              <p className="text-xs text-ink/50">{lesson.duration}</p>
            </div>
            {!lesson.done && <span className="text-sm text-berry">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
