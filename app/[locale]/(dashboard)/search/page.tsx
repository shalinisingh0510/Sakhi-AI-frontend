"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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

const FILTER_KEYS: SearchCategory[] = ["all", "modules", "lessons", "support", "safety"];

const ITEM_META: Record<string, { accent: string; icon: SearchItem["icon"] }> = {
  "menstrual-health": { accent: "from-rose/15 to-blush", icon: "book" },
  "puberty-basics": { accent: "from-lavender/70 to-lavender/30", icon: "spark" },
  "personal-hygiene": { accent: "from-mint to-mint/35", icon: "spark" },
  "cramps-help": { accent: "from-peach to-peach/40", icon: "chat" },
  "nutrition-health": { accent: "from-mint/60 to-lavender/35", icon: "book" },
  "safety-consent": { accent: "from-blush to-rose/25", icon: "shield" },
  "mental-wellbeing": { accent: "from-blush/80 to-lavender/40", icon: "chat" },
  "progress-review": { accent: "from-mint/45 to-blush/50", icon: "spark" },
};

export default function SearchPage() {
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchCategory>("all");

  const searchItems = useMemo(() => {
    const items = t.raw("items") as Array<{
      id: string;
      title: string;
      description: string;
      href: string;
      category: Exclude<SearchCategory, "all">;
      tags: string[];
    }>;
    const categoryLabels = t.raw("categoryLabels") as Record<string, string>;

    return items.map((item) => ({
      ...item,
      ...ITEM_META[item.id],
      categoryLabel: categoryLabels[item.category],
    })) as SearchItem[];
  }, [t]);

  const quickSearches = t.raw("quickSearches") as string[];
  const quickActions = t.raw("quickActions") as Array<{ href: string; label: string }>;
  const searchStats = t.raw("stats") as Array<{ value: string; label: string }>;

  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = searchItems.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const searchable = [item.title, item.description, ...item.tags, item.categoryLabel]
      .join(" ")
      .toLowerCase();

    return matchesFilter && (normalizedQuery === "" || searchable.includes(normalizedQuery));
  });

  function clearFilters() {
    setQuery("");
    setActiveFilter("all");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="space-y-6">
          <Card padding="lg" className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40" glass>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                  <span className="flex h-2 w-2 rounded-full bg-rose" />
                  {t("badge")}
                </div>
                <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">{t("title")}</h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">{t("subtitle")}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {searchStats.map((stat) => (
                    <Card key={stat.label} padding="sm" className="border-white/70 bg-white/75 text-left shadow-none">
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
              label={t("inputLabel")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("inputPlaceholder")}
              leftIcon={<SearchIcon className="h-4 w-4" />}
              hint={t("inputHint")}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTER_KEYS.map((key) => {
                const active = key === activeFilter;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveFilter(key)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-berry/30 bg-blush text-berry shadow-sm"
                        : "border-peach/70 bg-white text-ink/60 hover:border-berry/20 hover:text-ink",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {t(`filters.${key}`)}
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">{t("results")}</p>
              <p className="text-xs text-ink/50">
                {normalizedQuery
                  ? t("matchesFor", { count: visibleItems.length, query: query.trim() })
                  : t("matchesBrowse", { count: visibleItems.length })}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              disabled={!query && activeFilter === "all"}
            >
              {t("clearFilters")}
            </Button>
          </div>

          <div className="space-y-4">
            {visibleItems.length === 0 ? (
              <Card padding="lg" className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blush text-berry">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold text-ink">{t("noMatchesTitle")}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{t("noMatchesDesc")}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
                  >
                    {t("openChat")}
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-flex items-center rounded-full border border-peach/70 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-berry/30 hover:bg-blush/40"
                  >
                    {t("browseLessons")}
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("quickSearchesTitle")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearches.map((term) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("quickActionsTitle")}</p>
            <div className="mt-4 space-y-3">
              {quickActions.map((action) => (
                <NavLink key={action.href + action.label} href={action.href} label={action.label} />
              ))}
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("searchTipTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("searchTipDesc")}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ResultCard({ item }: { item: SearchItem }) {
  return (
    <Link href={item.href} className="block">
      <Card padding="md" className="group border transition-all hover:-translate-y-0.5 hover:border-berry/30 hover:shadow-md">
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
              <span className="text-xs uppercase tracking-[0.16em] text-ink/35">{item.category}</span>
            </div>

            <h2 className="mt-2 font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-peach/35 px-3 py-1 text-xs text-ink/55">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <span className="mt-1 text-berry transition-transform group-hover:translate-x-1">→</span>
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
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function renderIcon(icon: SearchItem["icon"]) {
  switch (icon) {
    case "book":
      return <span aria-hidden="true">📖</span>;
    case "spark":
      return <span aria-hidden="true">✨</span>;
    case "chat":
      return <span aria-hidden="true">💬</span>;
    case "shield":
      return <span aria-hidden="true">🛡️</span>;
    default:
      return <span aria-hidden="true">🔎</span>;
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
