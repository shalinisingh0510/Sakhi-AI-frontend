"use client";

import React, { useState } from "react";
import {
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  X,
  CreditCard,
  RefreshCw,
  HeartHandshake,
} from "lucide-react";
import { useAnonymousTimerStore } from "@/lib/anonymous-timer-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { useAuthStore } from "@/lib/auth-store";

export function AnonymousPaywallModal() {
  const {
    isPaywallOpen,
    closePaywall,
    selectedPlan,
    setSelectedPlan,
    markPaid,
    resetTrial,
  } = useAnonymousTimerStore();

  const openAnonymousModal = useAnonymousModalStore((s) => s.openModal);
  const user = useAuthStore((s) => s.user);

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isPaywallOpen) return null;

  const handleSimulatePayment = async () => {
    setProcessing(true);
    // Simulate instantaneous secure payment verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProcessing(false);
    setSuccess(true);

    setTimeout(() => {
      markPaid();
      setSuccess(false);
    }, 1200);
  };

  const handleLinkFreeAccount = () => {
    closePaywall();
    openAnonymousModal("convert");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-md transition-opacity"
        onClick={closePaywall}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-peach/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Top Header Gradient Banner */}
        <div className="relative bg-gradient-to-br from-emerald-800 via-teal-900 to-ink p-6 text-white text-center">
          <button
            type="button"
            onClick={closePaywall}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shadow-inner">
            <Shield className="h-7 w-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200 border border-amber-400/30 mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>10-Minute Free Anonymous Preview Ended</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Unlock Unlimited Anonymous Mode
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/80 max-w-sm mx-auto">
            Continue tracking your cycle, chatting with Sakhi AI, and calculating metrics with 100% mathematical anonymity. Zero identity stored.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Success Notification */}
          {success ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">
                Unlimited Anonymous Access Unlocked!
              </h3>
              <p className="text-xs text-emerald-700">
                Your private pass is active. You can now use all calculators, chat, and trackers without time restrictions.
              </p>
            </div>
          ) : (
            <>
              {/* Feature Highlights */}
              <div className="rounded-2xl bg-cream/40 p-3.5 border border-peach/50 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-ink/80">
                    <strong>Unlimited Sakhi AI Consultations</strong> — 24/7 symptom advice without any account.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-ink/80">
                    <strong>Full Clinical Calculators Suite</strong> — Period, ovulation, and due-date algorithms.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-ink/80">
                    <strong>Zero Personal Identifiers</strong> — No name, email, or device ID stored on any server.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-ink/80">
                    <strong>16-Character Cryptographic Recovery Key</strong> — Restore across devices securely.
                  </span>
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("monthly")}
                  className={`relative rounded-2xl p-4 text-left border-2 transition-all ${
                    selectedPlan === "monthly"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-peach/70 bg-white hover:border-emerald-300"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                    Monthly Pass
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-ink font-display">₹99</span>
                    <span className="text-[11px] text-ink/50">/ month ($1.99)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-ink/70">
                    Flexible, cancel anytime.
                  </p>
                </button>

                {/* Annual Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("annual")}
                  className={`relative rounded-2xl p-4 text-left border-2 transition-all ${
                    selectedPlan === "annual"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-peach/70 bg-white hover:border-emerald-300"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    SAVE 60%
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                    Annual Pass
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-ink font-display">₹699</span>
                    <span className="text-[11px] text-ink/50">/ year ($14.99)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800 font-medium">
                    Only ₹58/mo. Full 365 days.
                  </p>
                </button>
              </div>

              {/* Primary Unlock Button */}
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={processing}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-800 active:scale-98 transition-all flex items-center justify-center gap-2 group"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Activating Anonymous Pass...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
                    <span>
                      Unlock Unlimited Anonymous Mode ({selectedPlan === "monthly" ? "₹99 / $1.99" : "₹699 / $14.99"})
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Free Alternative Option */}
              <div className="pt-2 border-t border-peach/50 text-center space-y-2">
                <p className="text-xs text-ink/60">
                  Prefer not to pay right now?
                </p>
                <button
                  type="button"
                  onClick={handleLinkFreeAccount}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-berry hover:text-berry/80 underline underline-offset-2 transition-colors"
                >
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>Link a free email account to retain your data for $0</span>
                </button>
              </div>

              {/* Dev/Demo Helper to reset trial timer */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={resetTrial}
                  className="text-[10px] text-ink/35 hover:text-ink/60 underline"
                >
                  [Demo Mode: Reset 10-Min Free Trial Timer]
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
