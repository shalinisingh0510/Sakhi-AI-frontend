"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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

const ITEM_META: Record<string, { accent: string; icon: string; unread: boolean }> = {
  "lesson-reminder": { accent: "from-rose/15 to-blush", icon: "book", unread: true },
  "chat-response": { accent: "from-lavender/80 to-lavender/30", icon: "chat", unread: true },
  "streak-update": { accent: "from-mint to-mint/40", icon: "spark", unread: false },
  "safety-tip": { accent: "from-peach to-peach/40", icon: "shield", unread: false },
  "account-update": { accent: "from-blush to-rose/20", icon: "user", unread: false },
};

const FILTER_KEYS: NotificationCategory[] = ["all", "updates", "lessons", "chat", "safety", "account"];

export default function NotificationsPage() {
  const t = useTranslations("Notifications");
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");

  const initialNotifications = useMemo(() => {
    const items = t.raw("items") as Array<{
      id: string;
      category: Exclude<NotificationCategory, "all">;
      title: string;
      message: string;
      time: string;
      cta: string;
      href: string;
    }>;

    return items.map((item) => ({
      ...item,
      ...ITEM_META[item.id],
    })) as NotificationItem[];
  }, [t]);

  const [notifications, setNotifications] = useState(initialNotifications);

  const visibleNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    return notification.category === activeFilter;
  });

  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const lessonCount = notifications.filter((n) => n.category === "lessons" && n.unread).length;
  const safetyCount = notifications.filter((n) => n.category === "safety" && n.unread).length;

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
                  {t("badge")}
                </div>
                <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{t("title")}</h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">{t("subtitle")}</p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-soft backdrop-blur-sm sm:w-56">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-berry text-lg text-white shadow-sm">
                    🔔
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("unread")}</p>
                    <p className="font-display text-2xl font-bold text-berry">{unreadCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-ink/55">
                  <div className="rounded-2xl bg-peach/35 p-3">
                    <p className="font-semibold text-ink">{lessonCount}</p>
                    <p className="mt-1">{t("lessonItems")}</p>
                  </div>
                  <div className="rounded-2xl bg-mint/40 p-3">
                    <p className="font-semibold text-ink">{safetyCount}</p>
                    <p className="mt-1">{t("safetyAlerts")}</p>
                  </div>
                </div>
              </div>
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

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={markAllAsRead} variant="primary" size="sm">
              {t("markAllRead")}
            </Button>
            <Button type="button" onClick={clearReadNotifications} variant="secondary" size="sm">
              {t("clearRead")}
            </Button>
            <Link
              href="/chat"
              className="inline-flex items-center rounded-full border border-peach/70 bg-white px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-berry/30 hover:bg-blush/40"
            >
              {t("openChat")}
            </Link>
          </div>

          <div className="space-y-4">
            {visibleNotifications.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="font-display text-2xl font-bold text-ink">{t("emptyTitle")}</p>
                <p className="mt-2 text-sm text-ink/60">{t("emptyDesc")}</p>
                <Link
                  href="/learn"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-rose to-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-berry hover:to-rose"
                >
                  {t("exploreLessons")}
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
                    <span
                      className={[
                        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg shadow-sm",
                        notification.accent,
                      ].join(" ")}
                    >
                      {renderIcon(notification.icon)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold text-ink">{notification.title}</h2>
                            {notification.unread && (
                              <span className="rounded-full bg-rose/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-berry">
                                {t("new")}
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
                            {t("markRead")}
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("overviewTitle")}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-peach/60 bg-white/80 p-4">
                <p className="text-sm text-ink/55">{t("overviewUnread")}</p>
                <p className="mt-1 font-display text-3xl font-bold text-berry">{unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-peach/60 bg-white/80 p-4">
                <p className="text-sm text-ink/55">{t("overviewFocus")}</p>
                <p className="mt-1 font-semibold text-ink">{t("overviewFocusDesc")}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("shortcutsTitle")}</p>
            <div className="mt-4 space-y-3">
              <NavLink href="/learn" label={t("shortcutLearn")} />
              <NavLink href="/progress" label={t("shortcutProgress")} />
              <NavLink href="/help" label={t("shortcutHelp")} />
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-mint/45 to-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">{t("safetyTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("safetyDesc")}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-peach/60 bg-white px-4 py-3 text-sm font-medium text-ink transition-all hover:border-berry/25 hover:bg-blush/45"
    >
      <span>{label}</span>
      <span>→</span>
    </Link>
  );
}

function renderIcon(icon: string) {
  switch (icon) {
    case "book":
      return <span aria-hidden="true">📖</span>;
    case "chat":
      return <span aria-hidden="true">💬</span>;
    case "spark":
      return <span aria-hidden="true">✨</span>;
    case "shield":
      return <span aria-hidden="true">🛡️</span>;
    case "user":
      return <span aria-hidden="true">👤</span>;
    default:
      return <span aria-hidden="true">🔔</span>;
  }
}
