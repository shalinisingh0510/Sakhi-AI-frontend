"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Droplet,
  BookOpen,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

export function NotificationToast() {
  const activeToast = useNotificationStore((s) => s.activeToast);
  const dismissToast = useNotificationStore((s) => s.dismissToast);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.notification_type) {
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

  const actionUrl = activeToast.metadata?.action_url || "/notifications";
  const cta = activeToast.metadata?.cta || "View Details";

  const handleAction = () => {
    markAsRead(activeToast.id);
    dismissToast();
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-peach/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush/60 shrink-0 border border-peach/40 shadow-xs">
            {getIcon()}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="rounded-full bg-berry/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-berry">
                {activeToast.metadata?.cadence || "2-Hour Alert"}
              </span>
              <span className="text-[10px] text-ink/40">Just now</span>
            </div>
            <h4 className="font-display text-sm font-bold text-ink truncate">
              {activeToast.title}
            </h4>
            <p className="mt-1 text-xs text-ink/70 line-clamp-2 leading-relaxed">
              {activeToast.body}
            </p>

            {/* Action Link */}
            <div className="mt-2.5 flex items-center gap-2">
              <Link
                href={actionUrl}
                onClick={handleAction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-berry hover:text-berry/80 underline underline-offset-2 transition-colors"
              >
                <span>{cta}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={dismissToast}
            className="text-ink/40 hover:text-ink p-1 rounded-lg hover:bg-cream transition-colors shrink-0"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
