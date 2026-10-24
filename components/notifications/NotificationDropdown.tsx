"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  CheckCheck,
  Sparkles,
  Zap,
  Droplet,
  BookOpen,
  ArrowRight,
  Trash2,
  Clock,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

export function NotificationDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const isHi = locale === "hi";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const getHref = (path: string) => `${prefix}${path}`;

  const {
    notifications,
    unreadCount,
    browserPermission,
    requestBrowserPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    triggerEngineTick,
    fetchNotifications,
  } = useNotificationStore();

  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  if (!isOpen) return null;

  const handleSimulateNextAlert = async () => {
    setTriggering(true);
    await triggerEngineTick(undefined, true);
    setTriggering(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "cycle_alert":
        return <span className="text-base">🌸</span>;
      case "ovulation_alert":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      case "energy_insight":
        return <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />;
      case "activity_checkin":
        return <Droplet className="h-4 w-4 text-teal-500" />;
      case "module_published":
        return <span className="text-base">🎉</span>;
      case "learning_tip":
      default:
        return <BookOpen className="h-4 w-4 text-berry" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl border border-peach/80 bg-white/95 shadow-2xl backdrop-blur-md z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="border-b border-peach/50 p-4 bg-gradient-to-r from-cream via-white to-blush/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-bold text-ink">
              {isHi ? "सूचनाएं" : "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-berry px-2 py-0.2 text-[10px] font-extrabold text-white">
                {unreadCount} {isHi ? "नई" : "new"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-berry hover:text-berry/80 font-medium flex items-center gap-1 transition-colors"
                title={isHi ? "सभी पढ़ा हुआ मार्क करें" : "Mark all as read"}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{isHi ? "सब पढ़ें" : "Mark read"}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Hour Engine Banner */}
        <div className="mt-3 rounded-2xl bg-cream/70 p-2.5 border border-peach/50 flex flex-col gap-1.5 text-[11px] text-ink/75">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{isHi ? "2-घंटे का चक्र इंजन सक्रिय" : "2-Hour Cadence Engine Active"}</span>
            </span>
            <button
              type="button"
              onClick={handleSimulateNextAlert}
              disabled={triggering}
              className="rounded-lg bg-berry/10 hover:bg-berry/20 text-berry font-bold px-2 py-0.5 text-[10px] transition-all"
              title={isHi ? "अगला 2-घंटे का अलर्ट तुरंत टेस्ट करें" : "Test next 2-hour notification now"}
            >
              {triggering ? (isHi ? "भेजा जा रहा है..." : "Triggering...") : (isHi ? "अलर्ट टेस्ट करें" : "Simulate Alert")}
            </button>
          </div>
          <p className="text-[10px] text-ink/55 leading-tight">
            {isHi 
              ? "मासिक चक्र, ओव्यूलेशन, ऊर्जा, गतिविधि और स्वास्थ्य पर हर 2 घंटे में अलर्ट देता है।"
              : "Notifies you every 2 hours on Period, Ovulation, Energy, Activity, and Learning."}
          </p>
        </div>

        {/* Browser Push Permission Prompt if not granted */}
        {browserPermission !== "granted" && (
          <div className="mt-2 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 text-[11px] text-amber-900">
            <span>{isHi ? "डेस्कटॉप सूचनाएं सक्षम करें:" : "Enable desktop push notifications:"}</span>
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-0.5 text-[10px] transition-colors"
            >
              {isHi ? "सक्षम करें" : "Enable"}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-peach/30">
        {notifications.length === 0 ? (
          <div className="py-8 text-center px-4 space-y-2">
            <span className="text-2xl">🌸</span>
            <p className="text-xs font-semibold text-ink/70">
              {isHi ? "सब कुछ पढ़ा जा चुका है!" : "All caught up!"}
            </p>
            <p className="text-[11px] text-ink/45 max-w-xs mx-auto">
              {isHi 
                ? "आपके 2-घंटे के चक्र, ऊर्जा और शिक्षण अपडेट यहां स्वतः दिखाई देंगे।"
                : "Your 2-hour cycle, energy, and learning updates will appear here automatically."}
            </p>
          </div>
        ) : (
          notifications.slice(0, 15).map((n) => {
            const rawUrl = n.metadata?.action_url || "/notifications";
            const actionUrl = locale !== "en" && rawUrl.startsWith("/") && !rawUrl.startsWith(`/${locale}`)
              ? `/${locale}${rawUrl}`
              : rawUrl;
            const cta = n.metadata?.cta || (isHi ? "देखें" : "View");

            return (
              <div
                key={n.id}
                className={`p-3.5 transition-colors hover:bg-cream/40 flex items-start gap-3 ${
                  !n.is_read ? "bg-blush/20" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-peach/50 shrink-0 shadow-2xs mt-0.5">
                  {getIcon(n.notification_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-ink truncate">
                      {n.title}
                    </span>
                    {!n.is_read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-berry shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-ink/70 line-clamp-2 leading-relaxed">
                    {n.body}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <Link
                      href={actionUrl}
                      onClick={() => {
                        markAsRead(n.id);
                        onClose();
                      }}
                      className="font-semibold text-berry hover:underline flex items-center gap-0.5"
                    >
                      <span>{cta}</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteNotification(n.id)}
                      className="text-ink/30 hover:text-rose-600 transition-colors p-1"
                      title={isHi ? "हटाएं" : "Remove notification"}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-peach/50 bg-[#FFFDFB] p-3 text-center">
        <Link
          href={getHref("/notifications")}
          onClick={onClose}
          className="text-xs font-semibold text-berry hover:text-berry/80 flex items-center justify-center gap-1 transition-colors"
        >
          <span>{isHi ? "इनबॉक्स में सभी सूचनाएं देखें" : "View All Notifications in Inbox"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
