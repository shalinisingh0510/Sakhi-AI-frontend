"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { ShieldCheck, EyeOff, Key, Copy, Check } from "lucide-react";

export function AnonymousBanner() {
  const { user, togglePanicBlur } = useAuthStore();
  const { openModal } = useAnonymousModalStore();
  const [copied, setCopied] = useState(false);

  if (!user?.isAnonymous) return null;

  const handleCopyKey = () => {
    if (user.recoveryKey) {
      navigator.clipboard.writeText(user.recoveryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50 via-[#F3FAF7] to-teal-50/60 p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Flo-Grade Anonymous Mode Active
              </span>
              <span className="rounded-full bg-emerald-200/80 px-2 py-0.2 text-[10px] font-semibold text-emerald-800">
                100% Decoupled
              </span>
            </div>
            <p className="text-xs text-emerald-700/90 mt-0.5">
              Zero identifiers linked. Your cycle, mood, and symptom logs are cryptographically private.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.recoveryKey && (
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-white transition-all shadow-2xs"
              title="Copy secret recovery key to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-emerald-700" />}
              <span>{copied ? "Copied Key!" : "Copy Key"}</span>
            </button>
          )}

          <button
            onClick={() => openModal("shield")}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-all shadow-2xs"
          >
            <Key className="h-3.5 w-3.5" />
            <span>Shield Settings</span>
          </button>

          <button
            onClick={togglePanicBlur}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-white transition-all shadow-2xs"
            title="Instant Privacy Hide (Alt+H)"
          >
            <EyeOff className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden sm:inline">Panic Hide</span>
          </button>
        </div>
      </div>
    </div>
  );
}
