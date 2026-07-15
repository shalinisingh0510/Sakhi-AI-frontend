"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";

const QUICK_TILES = [
  {
    href: "/chat",
    emoji: "ðŸ’¬",
    title: "Chat with Sakhi",
    desc: "Ask anything about health, anytime.",
    bg: "from-rose/10 to-blush",
    border: "border-rose/20",
  },
  {
    href: "/learn",
    emoji: "ðŸ“–",
    title: "Start a Lesson",
    desc: "Explore health modules at your pace.",
    bg: "from-lavender to-lavender/40",
    border: "border-berry/20",
  },
  {
    href: "/progress",
    emoji: "ðŸ“Š",
    title: "My Progress",
    desc: "See your streaks and completed topics.",
    bg: "from-mint to-mint/40",
    border: "border-moss/20",
  },
  {
    href: "/profile",
    emoji: "ðŸ‘¤",
    title: "My Profile",
    desc: "Update your name, language, and more.",
    bg: "from-peach to-peach/40",
    border: "border-rose/20",
  },
];

const RECENT_TOPICS = [
  { emoji: "ðŸ©¸", label: "Menstrual Health" },
  { emoji: "ðŸ§˜", label: "Mental Wellbeing" },
  { emoji: "ðŸŒ¿", label: "Hygiene Basics" },
  { emoji: "ðŸ’Š", label: "Nutrition & Iron" },
  { emoji: "ðŸ¤°", label: "Reproductive Health" },
  { emoji: "ðŸ›¡ï¸", label: "Safety & Consent" },
];

const STATS = [
  { value: "3", label: "Day streak ðŸ”¥" },
  { value: "2", label: "Lessons done" },
  { value: "120", label: "Points earned" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      {/* Welcome header */}
      <section className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-moss">{greeting} ðŸ‘‹</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">
              {user?.name ? `Hi, ${user.name}!` : "Welcome to Sakhi AI"}
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Your trusted guide for women&apos;s health education.
            </p>
          </div>
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-soft">
            <span className="text-2xl">ðŸŒ¸</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <Card key={s.label} padding="sm" className="text-center">
              <p className="font-display text-2xl font-bold text-berry">{s.value}</p>
              <p className="mt-0.5 text-xs text-ink/60">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick tiles */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-ink">What would you like to do?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_TILES.map((tile) => (
            <Link key={tile.href} href={tile.href}>
              <div
                className={[
                  "group flex items-center gap-4 rounded-3xl border bg-gradient-to-br p-5 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5",
                  tile.bg,
                  tile.border,
                ].join(" ")}
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-sm">
                  {tile.emoji}
                </span>
                <div>
                  <p className="font-semibold text-ink">{tile.title}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{tile.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sakhi AI chat prompt */}
      <section className="mb-8">
        <Card className="bg-gradient-to-br from-blush/60 to-lavender/40 border-berry/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-lg shadow-sm">ðŸŒ¸</span>
            <div>
              <p className="font-semibold text-ink">Sakhi</p>
              <p className="text-xs text-ink/50">Your health guide</p>
            </div>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed">
            Hello {user?.name ?? "there"}! I&apos;m here whenever you have a question - about your body, health, or anything you&apos;re curious about. There&apos;s no judgment here. 💛
          </p>
          <Link
            href="/chat"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-berry hover:to-rose transition-all"
          >
            <span>Ask Sakhi</span>
            <span>â†’</span>
          </Link>
        </Card>
      </section>

      {/* Explore topics */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-ink">Explore topics</h2>
        <div className="flex flex-wrap gap-2">
          {RECENT_TOPICS.map((t) => (
            <Link
              key={t.label}
              href={`/learn?topic=${encodeURIComponent(t.label)}`}
              className="flex items-center gap-2 rounded-full border border-peach/70 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-berry/30 hover:bg-blush/50"
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
