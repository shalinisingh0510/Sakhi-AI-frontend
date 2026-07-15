"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type NotificationCategory = "all" | "updates" | "lessons" | "chat" | "safety" | "account";
type NotificationItem = {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  href: string;
  cta: string;
  accent: string;
  icon: string;
};

const FILTERS: Array<{ key: NotificationCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "updates", label: "Updates" },
  { key: "lessons", label: "Lessons" },
  { key: "chat", label: "Chat" },
  { key: "safety", label: "Safety" },
  { key: "account", label: "Account" },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "lesson-reminder",
    category: "lessons",
    title: "New lesson ready: Menstrual Health",
    message: "Continue where you left off and finish the next short lesson in under 5 minutes.",
    time: "2h ago",
    unread: true,
    href: "/learn/menstrual-health",
    cta: "Continue learning",
    accent: "from-rose/15 to-blush",
    icon: "book",
  },
  {
    id: "chat-response",
    category: "chat",
    title: "Sakhi replied to your question",
    message: "A gentle follow-up answer is waiting in your chat history with a summary and next steps.",
    time: "5h ago",
    unread: true,
    href: "/chat",
    cta: "Open chat",
    accent: "from-lavender/80 to-lavender/30",
    icon: "chat",
  },
  {
    id: "streak-update",
    category: "updates",
    title: "Your 3 day streak is growing",
    message: "You earned 40 points for staying consistent with your learning journey this week.",
    time: "Yesterday",
    unread: false,
    href: "/progress",
    cta: "View progress",
    accent: "from-mint to-mint/40",
    icon: "spark",
  },
  {
    id: "safety-tip",
    category: "safety",
    title: "Safety reminder for private browsing",
    message: "Use a personal device and clear history after reading sensitive topics when you need extra privacy.",
    time: "Yesterday",
    unread: false,
    href: "/help",
    cta: "Read help tips",
    accent: "from-peach to-peach/40",
    icon: "shield",
  },
  {
    id: "account-update",
    category: "account",
    title: "Profile preferences saved",
    message: "Your language preference and profile settings are synced across your current session.",
    time: "2 days ago",
    unread: false,
    href: "/profile",
    cta: "Review profile",
    accent: "from-blush to-rose/20",
    icon: "user",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");

  const visibleNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") {
      return true;
    }

    return notification.category === activeFilter;
  });

  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const lessonCount = notifications.filter((notification) => notification.category === "lessons" && notification.unread).length;
  const safetyCount = notifications.filter((notification) => notification.category === "safety" && notification.unread).length;

  function markAllAsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  }

  function markOneAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  }

  function clearReadNotifications() {
    setNotifications((current) => current.filter((notification) => notification.unread));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className="space-y-6">
          <Card className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40" padding="lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                  <span className="flex h-2 w-2 rounded-full bg-rose" />
                  Notifications center
                </div>
                <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                  Stay on top of lessons, reminders, and safety updates.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
                  This is your single place for new lesson prompts, Sakhi replies, progress updates, and account messages.
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-soft backdrop-blur-sm sm:w-56">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-berry text-lg text-white shadow-sm">
                    {"🔔"}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Unread</p>
                    <p className="font-display text-2xl font-bold text-berry">{unreadCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-ink/55">
                  <div className="rounded-2xl bg-peach/35 p-3">
                    <p className="font-semibold text-ink">{lessonCount}</p>
                    <p className="mt-1">Lesson items</p>
                  </div>
                  <div className="rounded-2xl bg-mint/40 p-3">
                    <p className="font-semibold text-ink">{safetyCount}</p>
                    <p className="mt-1">Safety alerts</p>
                  </div>
                </div>
              </div>
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

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={markAllAsRead} variant="primary" size="sm">
              Mark all as read
            </Button>
            <Button type="button" onClick={clearReadNotifications} variant="secondary" size="sm">
              Clear read items
            </Button>
            <Link
              href="/chat"
              className="inline-flex items-center rounded-full border border-peach/70 bg-white px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-berry/30 hover:bg-blush/40"
            >
              Open Sakhi chat
            </Link>
          </div>

          <div className="space-y-4">
            {visibleNotifications.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="font-display text-2xl font-bold text-ink">You are all caught up.</p>
                <p className="mt-2 text-sm text-ink/60">
                  There are no notifications in this filter right now. Check lessons, chat replies, or safety updates later.
                </p>
                <Link
                  href="/learn"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
                >
                  Explore lessons
                </Link>
              </Card>
            ) : (
              visibleNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  padding="md"
                  className={[
                    "border transition-all hover:-translate-y-0.5 hover:shadow-md",
                    notification.unread ? "border-berry/20 bg-white" : "border-peach/60 bg-white/85",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <span className={[
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg shadow-sm",
                      notification.accent,
                    ].join(" ")}>
                      {renderIcon(notification.icon)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold text-ink">{notification.title}</h2>
                            {notification.unread && (
                              <span className="rounded-full bg-rose/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-berry">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-ink/65">{notification.message}</p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">
                          {notification.time}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link
                          href={notification.href}
                          className="inline-flex items-center rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose"
                        >
                          {notification.cta}
                        </Link>
                        {notification.unread && (
                          <button
                            type="button"
                            onClick={() => markOneAsRead(notification.id)}
                            className="rounded-full border border-peach/70 px-4 py-2 text-sm font-medium text-ink/70 transition-all hover:border-berry/30 hover:text-ink"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <Card padding="lg" className="bg-gradient-to-br from-white to-blush/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Quick overview</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-peach/60 bg-white/80 p-4">
                <p className="text-sm text-ink/55">Unread items</p>
                <p className="mt-1 font-display text-3xl font-bold text-berry">{unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-peach/60 bg-white/80 p-4">
                <p className="text-sm text-ink/55">Current focus</p>
                <p className="mt-1 font-semibold text-ink">Lessons, chat replies, and safety reminders</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Shortcuts</p>
            <div className="mt-4 space-y-3">
              <Link
                href="/learn"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Continue learning</span>
                <span>{"→"}</span>
              </Link>
              <Link
                href="/progress"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Review progress</span>
                <span>{"→"}</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
              >
                <span>Get support</span>
                <span>{"→"}</span>
              </Link>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Safety note</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Sensitive health information should stay private. If you are using a shared device, clear your browser history after reading.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function renderIcon(icon: NotificationItem["icon"]) {
  switch (icon) {
    case "book":
      return <span aria-hidden="true">{"📖"}</span>;
    case "chat":
      return <span aria-hidden="true">{"💬"}</span>;
    case "spark":
      return <span aria-hidden="true">{"✨"}</span>;
    case "shield":
      return <span aria-hidden="true">{"🛡️"}</span>;
    case "user":
      return <span aria-hidden="true">{"👤"}</span>;
    default:
      return <span aria-hidden="true">{"🔔"}</span>;
  }
}
