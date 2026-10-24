"use client";

import React, { useEffect } from "react";
import {
  Shield,
  Clock,
  Zap,
  Lock,
  EyeOff,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAnonymousTimerStore } from "@/lib/anonymous-timer-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";

export function AnonymousTrialBanner() {
  const user = useAuthStore((s) => s.user);
  const togglePanicBlur = useAuthStore((s) => s.togglePanicBlur);

  const {
    secondsRemaining,
    isExpired,
    isPaid,
    tick,
    openPaywall,
  } = useAnonymousTimerStore();

  const openShieldModal = useAnonymousModalStore((s) => s.openModal);

  // Active countdown timer when in anonymous mode
  const isAnonymous = user?.isAnonymous ?? false;

  useEffect(() => {
    if (!isAnonymous || isPaid) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnonymous, isPaid, tick]);

  if (!isAnonymous) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isLowTime = !isPaid && secondsRemaining <= 120 && secondsRemaining > 0;

  return (
    <div
      className={`border-b transition-colors px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 ${
        isPaid
          ? "bg-emerald-900/90 text-emerald-100 border-emerald-800"
          : isExpired
          ? "bg-rose-950 text-rose-100 border-rose-800"
          : isLowTime
          ? "bg-amber-900 text-amber-100 border-amber-700 animate-pulse"
          : "bg-emerald-950 text-emerald-100 border-emerald-800/80"
      }`}
    >
      {/* Left: Mode Title & Explanation */}
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white shrink-0">
          <Shield className="h-3.5 w-3.5" />
        </div>
        <span className="font-bold tracking-tight">
          Sakhi AI Anonymous Mode
        </span>
        <span className="hidden sm:inline text-white/60">•</span>
        <span className="hidden sm:inline text-white/80">
          Zero personal data stored
        </span>
      </div>

      {/* Center: Trial Countdown / Status */}
      <div className="flex items-center gap-2 font-mono">
        {isPaid ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            <span>Unlimited Anonymous Access Active</span>
          </div>
        ) : isExpired ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-200 border border-rose-400/30">
            <Lock className="h-3 w-3" />
            <span>Trial Expired (00:00)</span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isLowTime
                ? "bg-amber-400/20 text-amber-200 border-amber-300/40"
                : "bg-white/10 text-emerald-200 border-white/15"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Free Trial: {formattedTime} left</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {!isPaid && (
          <button
            type="button"
            onClick={openPaywall}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1 ${
              isExpired
                ? "bg-rose-500 hover:bg-rose-600 text-white animate-bounce"
                : "bg-amber-400 hover:bg-amber-300 text-ink"
            }`}
          >
            <Zap className="h-3 w-3 fill-current" />
            <span>{isExpired ? "Unlock Now (₹99)" : "Upgrade"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => openShieldModal("shield")}
          className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white transition-colors flex items-center gap-1"
          title="View your 16-character recovery key"
        >
          <KeyRound className="h-3 w-3" />
          <span className="hidden md:inline">Recovery Key</span>
        </button>

        <button
          type="button"
          onClick={togglePanicBlur}
          className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-medium text-white/90 transition-colors flex items-center gap-1"
          title="Panic Hide screen (Alt+H)"
        >
          <EyeOff className="h-3 w-3" />
          <span className="hidden lg:inline">Panic Hide (Alt+H)</span>
        </button>
      </div>
    </div>
  );
}
