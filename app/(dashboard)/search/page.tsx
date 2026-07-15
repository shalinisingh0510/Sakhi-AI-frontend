"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type SearchCategory = "all" | "modules" | "lessons" | "support" | "safety";

type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: Exclude<SearchCategory, "all">;
  categoryLabel: string;
  tags: string[];
  accent: string;
  icon: "book" | "spark" | "chat" | "shield";
};

const FILTERS: Array<{ key: SearchCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "modules", label: "Modules" },
  { key: "lessons", label: "Lessons" },
  { key: "support", label: "Support" },
  { key: "safety", label: "Safety" },
];

const QUICK_SEARCHES = [
  "Menstrual cycle",
  "Cramps",
  "Hygiene tips",
  "Puberty changes",
  "Consent",
  "Ask Sakhi",
];

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "menstrual-health",
    title: "Menstrual Health",
    description: "Understand your cycle, track symptoms, and feel more confident each month.",
    href: "/learn/menstrual-health",
    category: "modules",
    categoryLabel: "Module",
    tags: ["cycle", "period", "tracking"],
    accent: "from-rose/15 to-blush",
    icon: "book",
  },
  {
    id: "puberty-basics",
    title: "Puberty Basics",
    description: "Learn about the body and emotional changes that can happen during puberty.",
    href: "/learn/puberty-basics",
    category: "modules",
    categoryLabel: "Module",
    tags: ["growth", "changes", "body"],
    accent: "from-lavender/70 to-lavender/30",
    icon: "spark",
  },
  {
    id: "personal-hygiene",
    title: "Personal Hygiene",
    description: "Simple daily habits to stay clean, healthy, and comfortable at school or at home.",
    href: "/learn/personal-hygiene",
    category: "lessons",
    categoryLabel: "Lesson",
    tags: ["hygiene", "routine", "care"],
    accent: "from-mint to-mint/35",
    icon: "spark",
  },
  {
    id: "cramps-help",
    title: "Why cramps happen",
    description: "A gentle explanation of period cramps and what can help you feel better.",
    href: "/chat",
    category: "support",
    categoryLabel: "Support",
    tags: ["cramps", "pain", "chat"],
    accent: "from-peach to-peach/40",
    icon: "chat",
  },
  {
    id: "nutrition-health",
    title: "Nutrition & Health",
    description: "Find iron-rich foods, calcium tips, and balanced meal ideas to support your body.",
    href: "/learn/nutrition-health",
    category: "modules",
    categoryLabel: "Module",
    tags: ["iron", "food", "calcium"],
    accent: "from-mint/60 to-lavender/35",
    icon: "book",
  },
  {
    id: "safety-consent",
    title: "Safety & Consent",
    description: "Know your rights, understand consent, and find help when you need it.",
    href: "/learn/safety-consent",
    category: "safety",
    categoryLabel: "Safety",
    tags: ["safety", "boundaries", "consent"],
    accent: "from-blush to-rose/25",
    icon: "shield",
  },
  {
    id: "mental-wellbeing",
    title: "Mental wellbeing check-in",
    description: "Use Sakhi for a calm conversation when you feel stressed, worried, or overwhelmed.",
    href: "/chat",
    category: "support",
    categoryLabel: "Support",
    tags: ["stress", "feelings", "chat"],
    accent: "from-blush/80 to-lavender/40",
    icon: "chat",
  },
  {
    id: "progress-review",
    title: "Your learning progress",
    description: "See streaks, points, and badges so you know what you have already completed.",
    href: "/progress",
    category: "lessons",
    categoryLabel: "Lesson",
    tags: ["streak", "points", "badges"],
    accent: "from-mint/45 to-blush/50",
    icon: "spark",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchCategory>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = SEARCH_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const searchable = [item.title, item.description, ...item.tags, item.categoryLabel]
      .join(" ")
      .toLowerCase();

    return matchesFilter && (normalizedQuery === "" || searchable.includes(normalizedQuery));
  });

  const searchStats = [
    { value: "6", label: "Topics" },
    { value: "3", label: "Support routes" },
    { value: "1", label: "Search box" },
  ];

  function clearFilters() {
    setQuery("");
    setActiveFilter("all");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="space-y-6">
          <Card
            padding="lg"
            className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40"
            glass
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                  <span className="flex h-2 w-2 rounded-full bg-rose" />
                  Search Sakhi AI
                </div>
                <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
                  Find the right support, lesson, or tip in seconds.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
                  Search across lessons, follow-up guidance, wellbeing check-ins, and safety
                  resources. We keep it calm, simple, and easy to revisit.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {searchStats.map((stat) => (
                    <Card
                      key={stat.label}
                      padding="sm"
                      className="border-white/70 bg-white/75 text-left shadow-none"
                    >
                      <p className="font-display text-2xl font-bold text-berry">{stat.value}</p>
                      <p className="mt-1 text-xs text-ink/55">{stat.label}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center lg:pr-2">
                <div className="absolute h-56 w-56 rounded-full bg-rose/10 blur-3xl" />
                <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 shadow-soft">
                  <SearchIcon className="h-16 w-16 text-berry" />
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-white/82 backdrop-blur-sm">
            <Input
              label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try menstrual cycle, cramps, hygiene, safety, or chat"
              leftIcon={<SearchIcon className="h-4 w-4" />}
              hint="Search works across learning topics and support actions."
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const active = filter.key === activeFilter;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-berry/30 bg-blush text-berry shadow-sm"
                        : "border-peach/70 bg-white text-ink/60 hover:border-berry/20 hover:text-ink",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Results</p>
              <p className="text-xs text-ink/50">
                {visibleItems.length} matches {normalizedQuery ? `for â€œ${query.trim()}â€` : "ready to browse"}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              disabled={!query && activeFilter === "all"}
            >
              Clear filters
            </Button>
          </div>

          <div className="space-y-4">
            {visibleItems.length === 0 ? (
              <Card padding="lg" className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blush text-berry">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold text-ink">No matches yet.</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  Try a different topic, or jump straight into chat, lessons, or progress.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
                  >
                    Open Sakhi chat
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-flex items-center rounded-full border border-peach/70 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-berry/30 hover:bg-blush/40"
                  >
                    Browse lessons
                  </Link>
                </div>
              </Card>
            ) : (
              visibleItems.map((item) => <ResultCard key={item.id} item={item} />)
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <Card padding="lg" className="bg-gradient-to-br from-white to-blush/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Quick searches
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setActiveFilter("all");
                  }}
                  className="rounded-full border border-peach/70 bg-white px-3 py-2 text-sm text-ink/70 transition-all hover:border-berry/30 hover:bg-blush/40 hover:text-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Quick actions
            </p>
            <div className="mt-4 space-y-3">
              <NavLink href="/chat" label="Ask Sakhi a question" />
              <NavLink href="/learn" label="Continue learning" />
              <NavLink href="/progress" label="Review progress" />
              <NavLink href="/learn/safety-consent" label="Safety resources" />
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Search tip
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              You can search for a health topic, a lesson title, or a support action like chat,
              progress, and safety.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ResultCard({ item }: { item: SearchItem }) {
  return (
    <Link href={item.href} className="block">
      <Card
        padding="md"
        className="group border transition-all hover:-translate-y-0.5 hover:border-berry/30 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <span
            className={[
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg shadow-sm",
              item.accent,
            ].join(" ")}
          >
            {renderIcon(item.icon)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-berry">
                {item.categoryLabel}
              </span>
              <span className="text-xs uppercase tracking-[0.16em] text-ink/35">
                {item.category}
              </span>
            </div>

            <h2 className="mt-2 font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-peach/35 px-3 py-1 text-xs text-ink/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <span className="mt-1 text-berry transition-transform group-hover:translate-x-1">
            â†’
          </span>
        </div>
      </Card>
    </Link>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
    >
      <span>{label}</span>
      <span aria-hidden="true">â†’</span>
    </Link>
  );
}

function renderIcon(icon: SearchItem["icon"]) {
  switch (icon) {
    case "book":
      return <span aria-hidden="true">ðŸ“–</span>;
    case "spark":
      return <span aria-hidden="true">âœ¨</span>;
    case "chat":
      return <span aria-hidden="true">ðŸ’¬</span>;
    case "shield":
      return <span aria-hidden="true">ðŸ›¡ï¸</span>;
    default:
      return <span aria-hidden="true">ðŸ”Ž</span>;
  }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
