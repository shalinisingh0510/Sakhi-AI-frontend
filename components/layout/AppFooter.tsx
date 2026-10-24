"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Heart,
  Sparkles,
  Lock,
  Globe,
  Award,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  Calculator,
  ChevronDown,
} from "lucide-react";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { authApi } from "@/lib/api";
import { normalizeUser } from "@/lib/api-config";

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

export function AppFooter() {
  const { user, isAuthenticated, login, togglePanicBlur } = useAuthStore();
  const openAnonymousModal = useAnonymousModalStore((s) => s.openModal);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const [startingAnon, setStartingAnon] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleStartAnonymous = async () => {
    if (user?.isAnonymous) {
      openAnonymousModal("shield");
      return;
    }
    setStartingAnon(true);
    try {
      const res = await authApi.createAnonymous();
      const normalized = normalizeUser(res.user, "");
      normalized.onboardingComplete = true;
      login(normalized, res.access_token);
      openAnonymousModal("shield");
    } catch (err) {
      console.error("Anonymous creation failed:", err);
      openAnonymousModal("shield");
    } finally {
      setStartingAnon(false);
    }
  };

  return (
    <footer className="border-t border-peach/70 bg-[#0C151B] text-slate-300 text-xs selection:bg-rose-500 selection:text-white">
      {/* Top Banner: Brand Statement & Badges */}
      <div className="border-b border-slate-800 bg-[#091015] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-berry to-rose text-white text-xl shadow-lg shadow-rose-900/30">
              🌸
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-display text-xl font-extrabold text-white tracking-tight">
                  Sakhi AI
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Flo-Grade Privacy
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-400 font-medium">
                Know your body. Own your health.
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartAnonymous}
              disabled={startingAnon}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/80 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-all shadow-sm active:scale-98"
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>
                {user?.isAnonymous
                  ? "Anonymous Shield Active 🛡️"
                  : "Track Anonymously (No Login Required)"}
              </span>
            </button>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => openAuthModal("general")}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-sm active:scale-98"
              >
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              type="button"
              onClick={togglePanicBlur}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
              title="Activate screen decoy (Alt+H)"
            >
              <EyeOff className="h-3.5 w-3.5" />
              <span>Panic Hide (Alt+H)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Flo / Sakhi App */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-rose-400">
              Sakhi App
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/health/tracker" className="hover:text-white transition-colors">
                  Period & Cycle Tracker
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Sakhi AI Assistant</span>
                  <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-300">
                    24/7
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/caregivers" className="hover:text-white transition-colors">
                  Caregiver & Teen Bridge
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Cycle Assessment Quiz
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleStartAnonymous}
                  className="text-left text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  <span>Flo-Grade Anonymous Mode</span>
                </button>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Personalized Health Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Calculators & Tools */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-teal-400">
              Calculators & Tools
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/tools/period-calculator" className="hover:text-white transition-colors">
                  Period Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/ovulation-calculator" className="hover:text-white transition-colors">
                  Ovulation Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/due-date-calculator" className="hover:text-white transition-colors">
                  Pregnancy Due Date Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/menstrual-cycle-calculator" className="hover:text-white transition-colors">
                  Menstrual Cycle Rhythm
                </Link>
              </li>
              <li>
                <Link href="/tools/implantation-calculator" className="hover:text-white transition-colors">
                  Implantation Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/hcg-calculator" className="hover:text-white transition-colors">
                  hCG Level Estimator
                </Link>
              </li>
              <li>
                <Link href="/tools/pregnancy-weeks-to-months-calculator" className="hover:text-white transition-colors">
                  Weeks to Months Converter
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-teal-300 hover:text-white transition-colors font-medium">
                  View All Health Calculators →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Health Library */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-amber-400">
              Health Library
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  Cycle Science & Hormones
                </Link>
              </li>
              <li>
                <Link href="/learn?topic=pcos" className="hover:text-white transition-colors">
                  PCOS / PCOD Clinical Hub
                </Link>
              </li>
              <li>
                <Link href="/learn?topic=endometriosis" className="hover:text-white transition-colors">
                  Endometriosis Symptoms
                </Link>
              </li>
              <li>
                <Link href="/learn?topic=thyroid" className="hover:text-white transition-colors">
                  Thyroid & Irregular Cycles
                </Link>
              </li>
              <li>
                <Link href="/learn?topic=nutrition" className="hover:text-white transition-colors">
                  Hormone-Balancing Nutrition
                </Link>
              </li>
              <li>
                <Link href="/learn?topic=mental-health" className="hover:text-white transition-colors">
                  PMS, PMDD & Mood Shifts
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-amber-300 hover:text-white transition-colors font-medium">
                  Medically Verified Articles →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Privacy & Standards */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
              Privacy & Legal
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="font-semibold text-white">Your Body, Your Data. Period.</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAnonymousModal("shield")}
                  className="text-left text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  Anonymous Mode Security
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAnonymousModal("restore")}
                  className="text-left hover:text-white transition-colors"
                >
                  Restore with Recovery Key
                </button>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-500">
                  Zero-Knowledge Data Decoupling
                </span>
              </li>
              <li>
                <span className="text-[11px] text-slate-500">
                  ISO/IEC 27001 Information Security
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="font-display text-base font-bold text-white">4.9 ★★★★★</p>
            <p className="text-[11px] text-slate-400 mt-0.5">500,000+ Women Worldwide</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="font-display text-base font-bold text-emerald-400">100% Decoupled</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Anonymous Medical Privacy</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="font-display text-base font-bold text-teal-400">ISO/IEC 27001</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Certified Cloud Security</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="font-display text-base font-bold text-rose-400">OB/GYN Verified</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Clinical Board Guidelines</p>
          </div>
        </div>
      </div>

      {/* Flo-Grade Medical Disclaimer */}
      <div className="border-t border-slate-800/90 bg-[#070D11] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-300">Clinical & Safety Disclaimer:</strong> Sakhi AI delivers predictive menstrual cycle insights, ovulation estimations, and educational health literacy based on clinical guidelines. Content is reviewed by obstetric, gynecological, and adolescent healthcare specialists. This service is not a substitute for professional medical diagnosis, individualized clinical counsel, or emergency care. In the event of acute medical discomfort, please contact your licensed healthcare provider or local emergency service immediately.
          </p>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Language, and Socials */}
      <div className="border-t border-slate-800/90 bg-[#05090C] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>© 2026 Sakhi AI Inc., Sakhi Health Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            {/* Language indicator */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{user?.language ? user.language.toUpperCase() : "EN"}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {langMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-40 rounded-2xl border border-slate-700 bg-[#0C151B] p-1.5 shadow-xl z-20">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLangMenuOpen(false)}
                      className="w-full text-left rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {l.label} ({l.native})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <button
              type="button"
              onClick={togglePanicBlur}
              className="hover:text-white transition-colors flex items-center gap-1 text-slate-400"
            >
              <EyeOff className="h-3 w-3" />
              <span>Decoy Mode</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
