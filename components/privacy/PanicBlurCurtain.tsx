"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Eye, Shield, Lock, BookOpen } from "lucide-react";

export function PanicBlurCurtain() {
  const { isPanicBlurred, setPanicBlur, togglePanicBlur } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Alt+H or Option+H to toggle privacy hide curtain
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        togglePanicBlur();
      }
      if (e.key === "Escape" && isPanicBlurred) {
        setPanicBlur(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanicBlurred, togglePanicBlur, setPanicBlur]);

  if (!isPanicBlurred) return null;

  return (
    <div
      role="region"
      aria-label="Privacy Decoy Screen"
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-stone-900 text-stone-100 p-6 sm:p-12 animate-in fade-in duration-150 backdrop-blur-2xl"
    >
      {/* Top Decoy Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-stone-400" />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-stone-200">
              Personal Study Notes & Reading Log
            </h2>
            <p className="text-xs text-stone-500">Biology · Ecology & Plant Growth Fundamentals</p>
          </div>
        </div>

        <button
          onClick={() => setPanicBlur(false)}
          className="flex items-center gap-2 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition-all shadow-sm"
          title="Press Alt+H to reveal"
        >
          <Eye className="h-3.5 w-3.5 text-emerald-400" />
          <span>Reveal Dashboard (Alt+H)</span>
        </button>
      </div>

      {/* Decoy Content */}
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <Lock className="h-3.5 w-3.5 text-amber-500/80" />
            <span>SESSION PRIVACY SHIELD ACTIVE · DECROY SCREEN ENGAGED</span>
          </div>

          <h3 className="text-xl font-serif text-stone-200">
            Chapter 4: Photosynthesis, Cellular Respiration & Floral Cycles
          </h3>

          <p className="text-sm text-stone-400 leading-relaxed">
            Light-dependent reactions take place in the thylakoid membrane of chloroplasts. Photons of light are absorbed by chlorophyll pigments, exciting electrons to higher energy orbitals. This electron transport chain generates ATP and NADPH used in the stroma for the Calvin cycle.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-stone-800/80 bg-stone-900/60 p-4">
              <p className="text-xs font-semibold text-stone-300">Phase 1: Carbon Fixation</p>
              <p className="text-xs text-stone-500 mt-1">Rubisco catalyzes the carboxylation of ribulose-1,5-bisphosphate.</p>
            </div>
            <div className="rounded-xl border border-stone-800/80 bg-stone-900/60 p-4">
              <p className="text-xs font-semibold text-stone-300">Phase 2: Reduction Phase</p>
              <p className="text-xs text-stone-500 mt-1">Glycerate 3-phosphate is phosphorylated and reduced to G3P molecules.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-600 px-2">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-stone-500" />
            Sakhi AI Anonymous Mode Protection
          </span>
          <span>Click &apos;Reveal Dashboard&apos; or press Alt+H when safe</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-stone-600 border-t border-stone-800/60 pt-4">
        Sakhi AI · Zero-Knowledge Privacy Architecture
      </div>
    </div>
  );
}
