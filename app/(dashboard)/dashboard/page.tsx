"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";

const QUICK_TILE_META = [
  { href: "/chat", emoji: "💬", bg: "from-rose/10 to-blush", border: "border-rose/20" },
  { href: "/learn", emoji: "📖", bg: "from-lavender to-lavender/40", border: "border-berry/20" },
  { href: "/progress", emoji: "📊", bg: "from-mint to-mint/40", border: "border-moss/20" },
  { href: "/profile", emoji: "👤", bg: "from-peach to-peach/40", border: "border-rose/20" },
];

const TOPIC_EMOJIS = ["🩸", "🧘", "🌿", "💊", "🤰", "🛡️"];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const t = useTranslations("Dashboard");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("greetings.morning") : hour < 17 ? t("greetings.afternoon") : t("greetings.evening");

  const stats = t.raw("stats") as { value: string; label: string }[];
  const quickTiles = t.raw("quickTiles") as { title: string; desc: string }[];
  const topics = t.raw("topics") as string[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <section className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-moss">{greeting} 👋</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">
              {user?.name ? t("hiName", { name: user.name }) : t("welcomeFallback")}
            </h1>
            <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
          </div>
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-soft">
            <span className="text-2xl">🌸</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} padding="sm" className="text-center">
              <p className="font-display text-2xl font-bold text-berry">{s.value}</p>
              <p className="mt-0.5 text-xs text-ink/60">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-ink">{t("quickTilesTitle")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickTiles.map((tile, index) => {
            const meta = QUICK_TILE_META[index];
            return (
              <Link key={meta.href} href={meta.href}>
                <div
                  className={[
                    "group flex items-center gap-4 rounded-3xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft",
                    meta.bg,
                    meta.border,
                  ].join(" ")}
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-sm">
                    {meta.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{tile.title}</p>
                    <p className="mt-0.5 text-xs text-ink/60">{tile.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <Card className="border-berry/20 bg-gradient-to-br from-blush/60 to-lavender/40">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-lg shadow-sm">
              🌸
            </span>
            <div>
              <p className="font-semibold text-ink">{t("sakhiName")}</p>
              <p className="text-xs text-ink/50">{t("sakhiRole")}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink/80">
            {t("sakhiMessage", { name: user?.name ?? t("sakhiMessageFallback") })}
          </p>
          <Link
            href="/chat"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
          >
            <span>{t("askSakhi")}</span>
            <span>→</span>
          </Link>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-ink">{t("exploreTopics")}</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((label, index) => (
            <Link
              key={label}
              href={`/learn?topic=${encodeURIComponent(label)}`}
              className="flex items-center gap-2 rounded-full border border-peach/70 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-berry/30 hover:bg-blush/50"
            >
              <span>{TOPIC_EMOJIS[index]}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
