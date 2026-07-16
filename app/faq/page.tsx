"use client";

import { useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type FAQCategory = "all" | "general" | "health" | "safety" | "account" | "technical";

type FAQItem = {
  id: string;
  category: Exclude<FAQCategory, "all">;
  question: string;
  answer: string;
  accent: string;
};

const FILTERS: Array<{ key: FAQCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "general", label: "General" },
  { key: "health", label: "Health" },
  { key: "safety", label: "Safety" },
  { key: "account", label: "Account" },
  { key: "technical", label: "Technical" },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-is-sakhi",
    category: "general",
    question: "What is Sakhi AI?",
    answer: "Sakhi AI is a multilingual women's health education platform designed to provide safe, accurate, and culturally sensitive information about periods, hygiene, puberty, nutrition, mental wellbeing, and more. It's like having a trusted elder sister who explains things without judgment.",
    accent: "from-rose/15 to-blush",
  },
  {
    id: "is-medical-advice",
    category: "health",
    question: "Is Sakhi AI a substitute for medical advice?",
    answer: "No. Sakhi AI is for educational purposes only. While we provide accurate health information, we cannot replace professional medical advice. Always consult a doctor or healthcare provider for medical concerns, especially for persistent symptoms or emergencies.",
    accent: "from-lavender/80 to-lavender/30",
  },
  {
    id: "age-appropriate",
    category: "general",
    question: "What age group is Sakhi AI for?",
    answer: "Sakhi AI is designed for girls (10-13 years), teenagers (14-18 years), women (18+), mothers, and caregivers. The content adapts to different age groups, using age-appropriate language and explanations.",
    accent: "from-mint to-mint/40",
  },
  {
    id: "languages-supported",
    category: "general",
    question: "What languages are supported?",
    answer: "Currently, Sakhi AI supports English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati, Punjabi, and Odia. We're continuously working to add more regional languages to make health education accessible to everyone.",
    accent: "from-peach to-peach/40",
  },
  {
    id: "privacy-data",
    category: "safety",
    question: "Is my health information private?",
    answer: "Yes, your privacy is very important to us. We do not share your personal health information with third parties. We recommend using a personal device and clearing browser history after reading sensitive topics, especially if you use a shared device.",
    accent: "from-blush to-rose/25",
  },
  {
    id: "first-period",
    category: "health",
    question: "What should I know about my first period?",
    answer: "Your first period is a normal part of growing up. It usually happens between ages 10-15, but everyone is different. Signs include breast development, vaginal discharge, and growth spurts. Keep a small kit with pads, clean underwear, and wipes. Talk to a trusted adult if you have questions.",
    accent: "from-rose/15 to-blush",
  },
  {
    id: "account-delete",
    category: "account",
    question: "How do I delete my account?",
    answer: "To delete your account, go to Settings and look for the account management options. You can also contact our support team at hello@sakhi.ai for assistance. Note that deleting your account will remove your learning progress and chat history.",
    accent: "from-lavender/80 to-lavender/30",
  },
  {
    id: "offline-access",
    category: "technical",
    question: "Can I use Sakhi AI offline?",
    answer: "Currently, Sakhi AI requires an internet connection to access lessons and chat features. We're working on offline capabilities for future updates so you can learn even without connectivity.",
    accent: "from-mint to-mint/40",
  },
  {
    id: "safety-emergency",
    category: "safety",
    question: "What if I have a medical emergency?",
    answer: "If you have a medical emergency, please contact emergency services immediately or go to the nearest hospital. Sakhi AI is not equipped to handle emergencies. For urgent health concerns, always seek professional medical help right away.",
    accent: "from-blush to-rose/25",
  },
  {
    id: "content-accuracy",
    category: "health",
    question: "How accurate is the health information?",
    answer: "Our content is reviewed by health educators and follows WHO guidelines for women's health education. We prioritize scientific accuracy while keeping explanations simple and easy to understand. We update our content regularly based on new health guidelines.",
    accent: "from-rose/15 to-blush",
  },
  {
    id: "parental-guidance",
    category: "general",
    question: "Can parents use Sakhi AI?",
    answer: "Yes, parents and caregivers are welcome to use Sakhi AI to learn how to have conversations about health with their children. We provide guidance on answering questions clearly and compassionately, creating a supportive environment at home.",
    accent: "from-peach to-peach/40",
  },
  {
    id: "report-issue",
    category: "technical",
    question: "How do I report a technical issue?",
    answer: "If you encounter any technical problems, please contact our support team at hello@sakhi.ai with details about the issue, including what you were trying to do and any error messages you saw. We'll work to resolve it as quickly as possible.",
    accent: "from-mint to-mint/40",
  },
];

export default function FAQPage() {
  const [activeFilter, setActiveFilter] = useState<FAQCategory>("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const visibleFAQs = FAQ_ITEMS.filter((faq) => {
    if (activeFilter === "all") return true;
    return faq.category === activeFilter;
  });

  function toggleExpand(id: string) {
    setExpandedItem((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className="space-y-6">
          <Card
            padding="lg"
            className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40"
            glass
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                <span className="flex h-2 w-2 rounded-full bg-rose" />
                FAQ
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
                Frequently asked questions
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
                Find answers about Sakhi AI, health topics, safety, account settings, and technical support.
              </p>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
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

          <div className="space-y-4">
            {visibleFAQs.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="font-display text-2xl font-bold text-ink">No FAQs found.</p>
                <p className="mt-2 text-sm text-ink/60">
                  Try selecting a different category or check back later.
                </p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Quick links
            </p>
            <div className="mt-4 space-y-3">
              <Link
                href="/learn"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Browse lessons</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Ask Sakhi</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Get help</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Still have questions?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
             Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <Link
              href="/help"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
            >
              Contact support
            </Link>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Safety reminder
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              For medical emergencies, always contact emergency services or visit a hospital immediately.
            </p>
          </Card>
        </aside>
      </div>
    </div>
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
    <Card
      padding="md"
      className="border transition-all hover:border-berry/30"
    >
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
          {isExpanded && (
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{faq.answer}</p>
          )}
        </div>
      </button>
    </Card>
  );
}
