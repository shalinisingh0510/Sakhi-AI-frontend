"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { useEffect, useState, useCallback } from "react";
import { learningApi, type LearningContentListResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

const MODULE_META: Record<string, { emoji: string; color: string; border: string }> = {
  "menstrual-health": { emoji: "🩸", color: "from-rose/10 to-blush", border: "border-rose/20" },
  "puberty-basics": { emoji: "🌸", color: "from-lavender to-lavender/40", border: "border-berry/20" },
  "personal-hygiene": { emoji: "🌿", color: "from-mint to-mint/40", border: "border-moss/20" },
  "mental-wellbeing": { emoji: "🧘", color: "from-peach to-peach/40", border: "border-rose/20" },
  "nutrition-health": { emoji: "🥗", color: "from-mint/60 to-lavender/40", border: "border-moss/20" },
  "safety-consent": { emoji: "🛡️", color: "from-blush to-peach/40", border: "border-berry/20" },
  "default": { emoji: "📚", color: "from-slate-100 to-slate-200/40", border: "border-slate-300" }
};

export default function LearnPage() {
  const t = useTranslations("Learn");
  const { token, user } = useAuthStore();
  const [data, setData] = useState<LearningContentListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    if (!token) return;
    try {
      const res = await learningApi.getFeed(token);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch learning content", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-berry" />
      </div>
    );
  }

  if (!token) {
    return <div className="text-center py-10">Please log in to view learning modules.</div>;
  }

  const items = data?.items || [];
  const completedCount = 0; // Will be dynamic when summary API is integrated

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">
          {t("progressSummary", { completed: completedCount, total: items.length })}
        </p>
        <div className="mt-4 h-2 w-full rounded-full bg-peach/60">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-700"
            style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-lg text-slate-500">
          No learning content available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((mod) => {
            const meta = MODULE_META[mod.category] || MODULE_META["default"];
            const progress = 0; // TODO: Integrate individual progress API

            return (
              <Link key={mod.id} href={`/learn/${mod.id}`}>
                <Card
                  padding="sm"
                  className={[
                    "group flex h-full flex-col border bg-gradient-to-br transition-all duration-200 hover:-translate-y-1 hover:shadow-soft",
                    meta.color,
                    meta.border,
                  ].join(" ")}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-sm">
                      {meta.emoji}
                    </span>
                    {progress === 100 && (
                      <span className="rounded-full bg-moss/20 px-2 py-0.5 text-xs font-semibold text-moss">
                        {t("done")}
                      </span>
                    )}
                    {progress > 0 && progress < 100 && (
                      <span className="rounded-full bg-berry/10 px-2 py-0.5 text-xs font-semibold text-berry">
                        {t("inProgress")}
                      </span>
                    )}
                  </div>

                  <h2 className="font-semibold text-ink">{mod.title}</h2>
                  <p className="mt-1 flex-1 text-xs text-ink/60">{mod.description || "No description provided."}</p>

                  <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
                    <span>{mod.content_type === "VIDEO" ? `${mod.duration_minutes} min video` : "Article"}</span>
                    <span className="font-medium text-berry transition-transform group-hover:translate-x-1">→</span>
                  </div>

                  {progress > 0 && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/50">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-rose to-berry"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
