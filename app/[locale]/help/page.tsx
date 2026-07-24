"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";

const CHANNEL_META = [
  { id: "email", icon: "📧", accent: "from-rose/15 to-blush" },
  { id: "chat", icon: "💬", accent: "from-lavender/80 to-lavender/30" },
  { id: "community", icon: "👥", accent: "from-mint to-mint/40" },
];

const TOPIC_ACCENTS = [
  "from-peach to-peach/40",
  "from-blush to-rose/25",
  "from-rose/15 to-blush",
  "from-lavender/80 to-lavender/30",
  "from-mint to-mint/40",
  "from-peach to-peach/40",
];

export default function HelpPage() {
  const t = useTranslations("Help");

  const channels = useMemo(() => {
    const items = t.raw("channels") as Array<{
      id: string;
      title: string;
      description: string;
      contact: string;
    }>;

    return items.map((item, i) => ({
      ...item,
      icon: CHANNEL_META[i]?.icon ?? "📧",
      accent: CHANNEL_META[i]?.accent ?? "from-rose/15 to-blush",
    }));
  }, [t]);

  const topics = useMemo(() => {
    const items = t.raw("topics") as Array<{
      id: string;
      title: string;
      description: string;
      items: string[];
    }>;

    return items.map((topic, i) => ({
      ...topic,
      accent: TOPIC_ACCENTS[i] ?? "from-peach to-peach/40",
    }));
  }, [t]);

  const resources = t.raw("resources") as Array<{
    id: string;
    title: string;
    description: string;
    href: string;
  }>;

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

          <Card padding="lg" className="bg-white/82 backdrop-blur-sm">
            <h2 className="font-display text-xl font-bold text-ink">{t("contactTitle")}</h2>
            <p className="mt-2 text-sm text-ink/60">{t("contactDesc")}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {channels.map((channel) => (
                <Card key={channel.id} padding="md" className="border transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col items-center text-center">
                    <span
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm",
                        channel.accent,
                      ].join(" ")}
                    >
                      {channel.icon}
                    </span>
                    <h3 className="mt-3 font-semibold text-ink">{channel.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink/60">{channel.description}</p>
                    <p className="mt-2 text-sm font-medium text-berry">{channel.contact}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-ink">{t("topicsTitle")}</h2>
            {topics.map((topic) => (
              <HelpTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Card padding="lg" className="bg-gradient-to-br from-white to-blush/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("quickLinksTitle")}</p>
            <div className="mt-4 space-y-3">
              <NavLink href="/faq" label={t("faq")} />
              <NavLink href="/learn" label={t("browseLessons")} />
              <NavLink href="/chat" label={t("askSakhi")} />
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("resourcesTitle")}</p>
            <div className="mt-4 space-y-3">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.href}
                  className="block rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
                >
                  <p className="font-semibold">{resource.title}</p>
                  <p className="mt-1 text-xs text-ink/55">{resource.description}</p>
                </Link>
              ))}
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("emergencyTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("emergencyDesc")}</p>
            <div className="mt-4 rounded-2xl border border-rose/20 bg-rose/10 p-4">
              <p className="text-sm font-semibold text-berry">{t("emergencyNumber")}</p>
              <p className="mt-1 text-xs text-ink/60">{t("emergencyCall")}</p>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("feedbackTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("feedbackDesc")}</p>
            <Link
              href="mailto:hello@sakhi.ai?subject=Feedback"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
            >
              {t("sendFeedback")}
            </Link>
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

function HelpTopicCard({
  topic,
}: {
  topic: {
    id: string;
    title: string;
    description: string;
    items: string[];
    accent: string;
  };
}) {
  return (
    <Card padding="md" className="border transition-all hover:border-berry/30">
      <div className="flex items-start gap-4">
        <span
          className={[
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm shadow-sm",
            topic.accent,
          ].join(" ")}
        >
          <span aria-hidden="true">📚</span>
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-ink">{topic.title}</h3>
          <p className="mt-2 text-sm text-ink/60">{topic.description}</p>
          <ul className="mt-3 space-y-2">
            {topic.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-berry/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
