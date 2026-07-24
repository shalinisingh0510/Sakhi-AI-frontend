"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";

type FAQCategory = "all" | "general" | "health" | "safety" | "account" | "technical";

type FAQItem = {
  id: string;
  category: Exclude<FAQCategory, "all">;
  question: string;
  answer: string;
  accent: string;
};

const FILTER_KEYS: FAQCategory[] = ["all", "general", "health", "safety", "account", "technical"];

const FAQ_ACCENTS: Record<string, string> = {
  "what-is-sakhi": "from-rose/15 to-blush",
  "is-medical-advice": "from-lavender/80 to-lavender/30",
  "age-appropriate": "from-mint to-mint/40",
  "languages-supported": "from-peach to-peach/40",
  "privacy-data": "from-blush to-rose/25",
  "first-period": "from-rose/15 to-blush",
  "account-delete": "from-lavender/80 to-lavender/30",
  "offline-access": "from-mint to-mint/40",
  "safety-emergency": "from-blush to-rose/25",
  "content-accuracy": "from-rose/15 to-blush",
  "parental-guidance": "from-peach to-peach/40",
  "report-issue": "from-mint to-mint/40",
};

export default function FAQPage() {
  const t = useTranslations("FAQ");
  const [activeFilter, setActiveFilter] = useState<FAQCategory>("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const faqItems = useMemo(() => {
    const items = t.raw("items") as Array<{
      id: string;
      category: Exclude<FAQCategory, "all">;
      question: string;
      answer: string;
    }>;

    return items.map((item) => ({
      ...item,
      accent: FAQ_ACCENTS[item.id] ?? "from-rose/15 to-blush",
    })) as FAQItem[];
  }, [t]);

  const visibleFAQs = faqItems.filter((faq) => {
    if (activeFilter === "all") return true;
    return faq.category === activeFilter;
  });

  function toggleExpand(id: string) {
    setExpandedItem((current) => (current === id ? null : id));
  }

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-8" tabIndex={-1}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className="space-y-6">
          <Card padding="lg" className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40" glass>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                <span className="flex h-2 w-2 rounded-full bg-rose" />
                {t("badge")}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">{t("title")}</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">{t("subtitle")}</p>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
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

          <div className="space-y-4">
            {visibleFAQs.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="font-display text-2xl font-bold text-ink">{t("emptyTitle")}</p>
                <p className="mt-2 text-sm text-ink/60">{t("emptyDesc")}</p>
              </Card>
            ) : (
              visibleFAQs.map((faq) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedItem === faq.id}
                  onToggle={() => toggleExpand(faq.id)}
                />
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <Card padding="lg" className="bg-gradient-to-br from-white to-blush/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("quickLinksTitle")}</p>
            <div className="mt-4 space-y-3">
              <NavLink href="/learn" label={t("browseLessons")} />
              <NavLink href="/chat" label={t("askSakhi")} />
              <NavLink href="/help" label={t("getHelp")} />
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("stillQuestionsTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("stillQuestionsDesc")}</p>
            <Link
              href="/help"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
            >
              {t("contactSupport")}
            </Link>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("safetyTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("safetyDesc")}</p>
          </Card>
        </aside>
      </div>
    </main>
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

function FAQCard({
  faq,
  isExpanded,
  onToggle,
}: {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card padding="md" className="border transition-all hover:border-berry/30">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 text-left"
        aria-expanded={isExpanded}
      >
        <span
          className={[
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm shadow-sm transition-all",
            faq.accent,
          ].join(" ")}
        >
          {isExpanded ? "−" : "+"}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-ink">{faq.question}</h3>
          {isExpanded && <p className="mt-3 text-sm leading-relaxed text-ink/65">{faq.answer}</p>}
        </div>
      </button>
    </Card>
  );
}
