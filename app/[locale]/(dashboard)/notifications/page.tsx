"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useNotificationStore, NOTIFICATION_INTERVAL_MS } from "@/lib/notification-store";
import { useAuthStore } from "@/lib/auth-store";
import type { ApiNotificationItem } from "@/lib/api";

type NotificationFilter = "all" | "cycle" | "energy" | "activity" | "learning" | "system";

const FILTER_TABS: { key: NotificationFilter; label: string; icon: string }[] = [
  { key: "all", label: "All Alerts", icon: "🔔" },
  { key: "cycle", label: "Cycle & Ovulation", icon: "🌸" },
  { key: "energy", label: "Energy Insights", icon: "⚡" },
  { key: "activity", label: "Activity & Hydration", icon: "💧" },
  { key: "learning", label: "Learning & Modules", icon: "📚" },
  { key: "system", label: "System & Safety", icon: "🛡️" },
];

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    triggerEngineTick,
    publishModule,
    requestBrowserPermission,
    browserPermission,
    lastTickTime,
  } = useNotificationStore();

  const user = useAuthStore((s) => s.user);
  const isAnonymous = user?.isAnonymous ?? false;

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("period_cycle");

  // Next cadence countdown calculation
  const nextTickRemainingMs = useMemo(() => {
    if (!lastTickTime) return 0;
    const elapsed = Date.now() - lastTickTime;
    return Math.max(0, NOTIFICATION_INTERVAL_MS - elapsed);
  }, [lastTickTime]);

  const nextTickHours = Math.floor(nextTickRemainingMs / (1000 * 60 * 60));
  const nextTickMins = Math.floor((nextTickRemainingMs % (1000 * 60 * 60)) / (1000 * 60));

  // Filter notifications
  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "cycle") {
        return item.notification_type === "cycle_alert" || item.notification_type === "ovulation_alert";
      }
      if (activeFilter === "energy") {
        return item.notification_type === "energy_insight";
      }
      if (activeFilter === "activity") {
        return item.notification_type === "activity_checkin";
      }
      if (activeFilter === "learning") {
        return (
          item.notification_type === "learning_tip" ||
          item.notification_type === "module_published" ||
          item.notification_type === "lesson_completed"
        );
      }
      if (activeFilter === "system") {
        return (
          item.notification_type === "system" ||
          item.notification_type === "reminder" ||
          item.notification_type === "announcement"
        );
      }
      return true;
    });
  }, [notifications, activeFilter]);

  const cycleCount = notifications.filter(
    (n) => (n.notification_type === "cycle_alert" || n.notification_type === "ovulation_alert") && !n.is_read
  ).length;

  const energyCount = notifications.filter(
    (n) => n.notification_type === "energy_insight" && !n.is_read
  ).length;

  const handleSimulateAlert = async () => {
    setIsSimulating(true);
    try {
      await triggerEngineTick(selectedTopic, true);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateModulePublish = async () => {
    setIsSimulating(true);
    try {
      await publishModule(
        "PCOS & Hormonal Equilibrium Masterclass",
        "mod_pcos_masterclass_1",
        "Clinical Modules",
        "New comprehensive evidence-backed module explaining androgen regulation and cycle recovery."
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearRead = async () => {
    const readItems = notifications.filter((n) => n.is_read);
    for (const item of readItems) {
      await deleteNotification(item.id);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      {/* Anonymous mode info notice */}
      {isAnonymous && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-berry/20 bg-blush/40 px-5 py-3 text-xs text-ink/80 backdrop-blur-sm sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-berry text-white text-xs font-bold">
              👤
            </span>
            <span>
              <strong>Anonymous Mode Active:</strong> All cycle, ovulation, and energy alerts are delivered locally to your browser without requiring your email.
            </span>
          </div>
          <Link
            href="/chat"
            className="hidden font-semibold text-berry hover:underline sm:inline-block"
          >
            Ask Sakhi AI →
          </Link>
        </div>
      )}

      {/* Browser Notification Permission Banner */}
      {browserPermission === "default" && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-peach/80 bg-gradient-to-r from-peach/30 via-white to-blush/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berry text-white">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Enable Native Browser Notifications</p>
              <p className="text-xs text-ink/65">
                Receive 2-hour cycle rhythm, energy forecasts, and hydration prompts right on your desktop or phone screen.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestBrowserPermission}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-berry px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose"
          >
            Allow Notifications
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        {/* Main Feed */}
        <section className="space-y-6">
          {/* Header Card */}
          <Card className="border-berry/20 bg-gradient-to-br from-blush/70 via-white to-lavender/40" padding="lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-berry shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-rose animate-pulse" />
                  Sakhi 2-Hour Intelligence Engine
                </div>
                <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                  Notification Center
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
                  Real-time alerts for your menstrual cycle, fertile window, metabolic energy, hydration check-ins, and published learning modules.
                </p>
              </div>

              {/* Status pill */}
              <div className="flex min-w-0 flex-col gap-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur-sm sm:w-56">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-berry text-lg text-white shadow-sm">
                    <Bell className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Unread</p>
                    <p className="font-display text-2xl font-bold text-berry">{unreadCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-ink/55">
                  <div className="rounded-2xl bg-peach/35 p-2.5">
                    <p className="font-semibold text-ink">{cycleCount}</p>
                    <p className="mt-0.5 text-[11px]">Cycle & Fertile</p>
                  </div>
                  <div className="rounded-2xl bg-mint/40 p-2.5">
                    <p className="font-semibold text-ink">{energyCount}</p>
                    <p className="mt-0.5 text-[11px]">Energy Insights</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Engine Simulation & Testing Toolbar */}
          <div className="rounded-2xl border border-peach/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-berry" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
                  Cadence: Every 2 Hours
                </span>
                <span className="rounded-full bg-mint/40 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                  {nextTickRemainingMs > 0
                    ? `Next in ~${nextTickHours}h ${nextTickMins}m`
                    : "Due now"}
                </span>
              </div>

              {/* Quick simulation controls */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="rounded-xl border border-peach/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-berry focus:outline-none"
                >
                  <option value="period_cycle">🌸 Period Cycle</option>
                  <option value="ovulation">✨ Ovulation / Fertile</option>
                  <option value="energy">⚡ Energy Forecast</option>
                  <option value="activity">💧 Activity / Hydration</option>
                  <option value="learning">📚 Learning Byte</option>
                </select>

                <Button
                  type="button"
                  onClick={handleSimulateAlert}
                  disabled={isSimulating}
                  variant="primary"
                  size="sm"
                  className="text-xs"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Trigger Alert
                </Button>

                <Button
                  type="button"
                  onClick={handleSimulateModulePublish}
                  disabled={isSimulating}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  Publish Module
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const active = tab.key === activeFilter;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? "border-berry/30 bg-blush text-berry shadow-sm"
                      : "border-peach/70 bg-white text-ink/65 hover:border-berry/20 hover:text-ink",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => markAllAsRead()}
                variant="secondary"
                size="sm"
                className="text-xs"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="mr-1.5 h-3.5 w-3.5 text-berry" />
                Mark All Read
              </Button>
              <Button
                type="button"
                onClick={handleClearRead}
                variant="secondary"
                size="sm"
                className="text-xs text-ink/60 hover:text-rose"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Clear Read
              </Button>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center gap-1 rounded-full border border-peach/70 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-berry/30 hover:bg-blush/40"
            >
              Ask Sakhi AI →
            </Link>
          </div>

          {/* List of Notifications */}
          <div className="space-y-3">
            {visibleNotifications.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blush/60 text-2xl">
                  🔔
                </span>
                <p className="mt-4 font-display text-xl font-bold text-ink">No alerts found</p>
                <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
                  {activeFilter === "all"
                    ? "Your notifications feed is clear! The engine runs every 2 hours to provide fresh cycle insights."
                    : "No notifications currently match this filter tab."}
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handleSimulateAlert()}
                    variant="primary"
                    size="sm"
                  >
                    Generate Test Alert
                  </Button>
                </div>
              </Card>
            ) : (
              visibleNotifications.map((item) => {
                const meta = getItemVisuals(item.notification_type);
                const actionUrl = item.metadata?.action_url || meta.defaultUrl;
                const cta = item.metadata?.cta || meta.defaultCta;
                const timeAgo = formatTimeAgo(item.created_at);

                return (
                  <Card
                    key={item.id}
                    padding="md"
                    className={[
                      "border transition-all hover:-translate-y-0.5 hover:shadow-md",
                      !item.is_read
                        ? "border-berry/25 bg-gradient-to-r from-blush/25 via-white to-white"
                        : "border-peach/60 bg-white/85",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <span
                        className={[
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm",
                          meta.bgClass,
                        ].join(" ")}
                      >
                        {meta.icon}
                      </span>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-peach/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/65">
                                {meta.tag}
                              </span>
                              <h2 className="text-sm font-bold text-ink sm:text-base">
                                {item.title}
                              </h2>
                              {!item.is_read && (
                                <span className="rounded-full bg-rose/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-berry">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-ink/75 sm:text-sm">
                              {item.body}
                            </p>
                          </div>

                          <span className="shrink-0 text-[11px] font-semibold text-ink/40">
                            {timeAgo}
                          </span>
                        </div>

                        {/* CTAs */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                          <Link
                            href={actionUrl}
                            onClick={() => {
                              if (!item.is_read) markAsRead(item.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-berry px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose"
                          >
                            <span>{cta}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>

                          {!item.is_read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(item.id)}
                              className="rounded-full border border-peach/80 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-berry/30 hover:text-ink"
                            >
                              Mark Read
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteNotification(item.id)}
                            className="rounded-full p-1.5 text-ink/40 transition hover:bg-peach/30 hover:text-rose"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Cadence Engine Info Card */}
          <Card padding="lg" className="border-berry/20 bg-gradient-to-br from-white via-blush/30 to-lavender/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-berry" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-berry">
                Autonomous Engine
              </p>
            </div>
            <p className="mt-2 text-sm font-bold text-ink">How 2-Hour Alerts Work</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/70">
              Sakhi calculates your biological cycle and dispatches alternating reminders every 2 hours:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-ink/75">
              <li className="flex items-center gap-2">
                <span>🌸</span>
                <span><strong>Period Cycle:</strong> Luteal & follicular phases</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✨</span>
                <span><strong>Fertility Window:</strong> Ovulation & peak fertility</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⚡</span>
                <span><strong>Energy Levels:</strong> Metabolic peak vs rest</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💧</span>
                <span><strong>Activity:</strong> Hydration & gentle pelvic movement</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📚</span>
                <span><strong>Curriculum:</strong> Newly published modules</span>
              </li>
            </ul>
          </Card>

          {/* Quick Shortcuts */}
          <Card padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Health Shortcuts
            </p>
            <div className="mt-3 space-y-2">
              <NavLink href="/tools/period-calculator" label="Period Calculator" icon="🩸" />
              <NavLink href="/tools/ovulation-calculator" label="Ovulation Calculator" icon="✨" />
              <NavLink href="/learn" label="Learning Curriculum" icon="📖" />
              <NavLink href="/chat" label="Chat with Sakhi AI" icon="💬" />
            </div>
          </Card>

          {/* Privacy Guarantee */}
          <Card padding="lg" className="border-peach/70 bg-gradient-to-br from-mint/30 to-white">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
                Sakhi AI Privacy
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink/70">
              In Anonymous Mode, health calculations remain private. No email, biometric ID, or personal data is collected or tracked.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-peach/60 bg-white px-3.5 py-2.5 text-xs font-semibold text-ink transition hover:border-berry/25 hover:bg-blush/40"
    >
      <span className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </span>
      <span>→</span>
    </Link>
  );
}

function getItemVisuals(type: ApiNotificationItem["notification_type"]) {
  switch (type) {
    case "cycle_alert":
      return {
        icon: "🌸",
        tag: "Cycle Rhythm",
        bgClass: "bg-rose/15 text-rose",
        defaultUrl: "/tools/period-calculator",
        defaultCta: "Check Period Rhythm",
      };
    case "ovulation_alert":
      return {
        icon: "✨",
        tag: "Ovulation & Fertility",
        bgClass: "bg-lavender/60 text-berry",
        defaultUrl: "/tools/ovulation-calculator",
        defaultCta: "View Fertile Window",
      };
    case "energy_insight":
      return {
        icon: "⚡",
        tag: "Energy Forecast",
        bgClass: "bg-peach/40 text-amber-600",
        defaultUrl: "/dashboard",
        defaultCta: "Energy Forecast",
      };
    case "activity_checkin":
      return {
        icon: "💧",
        tag: "Hydration & Movement",
        bgClass: "bg-mint/40 text-teal-700",
        defaultUrl: "/dashboard",
        defaultCta: "Log Activity",
      };
    case "module_published":
      return {
        icon: "📢",
        tag: "New Module Published",
        bgClass: "bg-blush text-berry",
        defaultUrl: "/learn",
        defaultCta: "Explore Module",
      };
    case "learning_tip":
      return {
        icon: "📚",
        tag: "Clinical Byte",
        bgClass: "bg-lavender/40 text-berry",
        defaultUrl: "/learn",
        defaultCta: "Read Guide",
      };
    case "lesson_completed":
      return {
        icon: "🎉",
        tag: "Milestone",
        bgClass: "bg-mint/40 text-teal-800",
        defaultUrl: "/learn",
        defaultCta: "Next Lesson",
      };
    default:
      return {
        icon: "🔔",
        tag: "System",
        bgClass: "bg-peach/30 text-ink",
        defaultUrl: "/dashboard",
        defaultCta: "View Details",
      };
  }
}

function formatTimeAgo(dateStr: string) {
  try {
    const timestamp = new Date(dateStr).getTime();
    if (isNaN(timestamp)) return "Just now";
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

