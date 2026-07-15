"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SUPPORT_CHANNELS = [
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 24 hours.",
    contact: "hello@sakhi.ai",
    icon: "📧",
    accent: "from-rose/15 to-blush",
  },
  {
    id: "chat",
    title: "In-App Chat",
    description: "Chat with Sakhi AI for quick questions about health topics.",
    contact: "Available 24/7",
    icon: "💬",
    accent: "from-lavender/80 to-lavender/30",
  },
  {
    id: "community",
    title: "Community Forum",
    description: "Connect with other users, share experiences, and find support.",
    contact: "Coming soon",
    icon: "👥",
    accent: "from-mint to-mint/40",
  },
];

const HELP_TOPICS = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn how to create an account, complete onboarding, and navigate the app.",
    items: [
      "How to create an account",
      "Completing your profile",
      "Choosing your language",
      "Understanding the dashboard",
    ],
    accent: "from-peach to-peach/40",
  },
  {
    id: "learning",
    title: "Learning & Lessons",
    description: "Find help with health modules, tracking progress, and accessing content.",
    items: [
      "Browsing health modules",
      "Starting a lesson",
      "Tracking your progress",
      "Resuming where you left off",
    ],
    accent: "from-blush to-rose/25",
  },
  {
    id: "chat",
    title: "Chat with Sakhi",
    description: "Get the most out of your conversations with Sakhi AI.",
    items: [
      "Asking effective questions",
      "Understanding Sakhi's responses",
      "Using quick prompts",
      "Chat history and privacy",
    ],
    accent: "from-rose/15 to-blush",
  },
  {
    id: "account",
    title: "Account & Settings",
    description: "Manage your profile, preferences, and privacy settings.",
    items: [
      "Updating your profile",
      "Changing language preference",
      "Notification settings",
      "Deleting your account",
    ],
    accent: "from-lavender/80 to-lavender/30",
  },
  {
    id: "safety",
    title: "Safety & Privacy",
    description: "Important information about keeping your information safe.",
    items: [
      "Privacy policy overview",
      "Data security measures",
      "Safe browsing tips",
      "Reporting concerns",
    ],
    accent: "from-mint to-mint/40",
  },
  {
    id: "technical",
    title: "Technical Support",
    description: "Troubleshoot common issues and find technical help.",
    items: [
      "App not loading properly",
      "Login problems",
      "Sync issues across devices",
      "Reporting bugs",
    ],
    accent: "from-peach to-peach/40",
  },
];

const RESOURCES = [
  {
    id: "user-guide",
    title: "User Guide",
    description: "Complete guide to using Sakhi AI effectively.",
    href: "/learn",
  },
  {
    id: "health-resources",
    title: "Health Resources",
    description: "Curated list of trusted health information sources.",
    href: "/learn",
  },
  {
    id: "for-parents",
    title: "For Parents & Caregivers",
    description: "Guidance for supporting young users.",
    href: "/learn",
  },
];

export default function HelpPage() {
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
                Help & Support
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
                How can we help you?
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
                Find answers, get support, and connect with our team. We're here to make your experience with Sakhi AI as smooth as possible.
              </p>
            </div>
          </Card>

          <Card padding="lg" className="bg-white/82 backdrop-blur-sm">
            <h2 className="font-display text-xl font-bold text-ink">Contact Support</h2>
            <p className="mt-2 text-sm text-ink/60">
              Choose the best way to reach us based on your needs.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {SUPPORT_CHANNELS.map((channel) => (
                <Card
                  key={channel.id}
                  padding="md"
                  className="border transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
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
                    <p className="mt-2 text-xs leading-relaxed text-ink/60">
                      {channel.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-berry">{channel.contact}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-ink">Help Topics</h2>
            {HELP_TOPICS.map((topic) => (
              <HelpTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Card padding="lg" className="bg-gradient-to-br from-white to-blush/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Quick links
            </p>
            <div className="mt-4 space-y-3">
              <Link
                href="/faq"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>FAQ</span>
                <span aria-hidden="true">→</span>
              </Link>
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
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Resources
            </p>
            <div className="mt-4 space-y-3">
              {RESOURCES.map((resource) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Emergency help
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              If you're in immediate danger or having a medical emergency, please contact emergency services right away.
            </p>
            <div className="mt-4 rounded-2xl bg-rose/10 border border-rose/20 p-4">
              <p className="text-sm font-semibold text-berry">Emergency: 112 / 911</p>
              <p className="mt-1 text-xs text-ink/60">Call emergency services immediately</p>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Feedback
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Help us improve Sakhi AI by sharing your feedback and suggestions.
            </p>
            <Link
              href="mailto:hello@sakhi.ai?subject=Feedback"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
            >
              Send feedback
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function HelpTopicCard({ topic }: { topic: typeof HELP_TOPICS[number] }) {
  return (
    <Card
      padding="md"
      className="border transition-all hover:border-berry/30"
    >
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
