"use client";

import Link from "next/link";
import { useEffect } from "react";
import { 
  X, 
  Heart, 
  Bookmark, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck
} from "lucide-react";
import { useAuthModalStore, type AuthPromptReason } from "@/lib/auth-modal-store";
import { GoogleAuthButton } from "./GoogleAuthButton";

const MODAL_CONTENT: Record<AuthPromptReason, {
  badge: string;
  icon: typeof Heart;
  title: string;
  subtitle: string;
  bullets: string[];
}> = {
  health: {
    badge: "PRIVATE WELLNESS HUB",
    icon: Heart,
    title: "Secure Your Private Health Hub",
    subtitle: "Your cycle logs, mood check-ins, and symptom patterns are deeply personal and end-to-end protected. Please log in to start tracking and safeguard your wellness history.",
    bullets: [
      "Confidential & encrypted cycle tracking",
      "Personalized hormonal rhythm insights",
      "Never shared with third parties or advertisers"
    ]
  },
  bookmark: {
    badge: "READING SANCTUARY",
    icon: Bookmark,
    title: "Save Your Bookmarks & Guides",
    subtitle: "Build your personal library of medically verified health guides, infographics, and school checklists accessible across all your devices.",
    bullets: [
      "Access saved guides anytime offline",
      "Organize bookmarks by life stages",
      "Sync bookmarks automatically when you log in"
    ]
  },
  progress: {
    badge: "WELLNESS MILESTONES",
    icon: Sparkles,
    title: "Track Your Learning Progress",
    subtitle: "Celebrate your growth! Create a free account to record completed modules, keep daily reading streaks, and unlock certified puberty literacy achievements.",
    bullets: [
      "Save module completion history",
      "Track your knowledge streaks",
      "Pick up right where you left off"
    ]
  },
  chat: {
    badge: "UNLIMITED SAKHI AI",
    icon: MessageCircle,
    title: "Chat Longer & Save Conversations",
    subtitle: "You're currently chatting with Sakhi in guest mode. Log in or create a free account to enjoy unlimited questions, save conversation history, and personalize answers to your cycle.",
    bullets: [
      "Save entire conversation threads",
      "Tailor answers to your age and language",
      "Seamless voice transcription & playback"
    ]
  },
  general: {
    badge: "WELCOME TO SAKHI AI",
    icon: Sparkles,
    title: "Join the Sakhi Community",
    subtitle: "Experience judgment-free health literacy, culturally tuned guidance, and compassionate conversational support.",
    bullets: [
      "100% stigma-free and private",
      "Available in 8+ Indian regional languages",
      "Vetted by certified pediatricians and gynecologists"
    ]
  }
};

export function AuthPromptModal() {
  const { isOpen, reason, closeAuthModal } = useAuthModalStore();
  const content = MODAL_CONTENT[reason] || MODAL_CONTENT.general;
  const Icon = content.icon;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeAuthModal} 
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blush/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-lavender/40 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-ink transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Icon & Badge */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-berry/10 text-berry shadow-2xs mb-3">
            <Icon size={26} className="text-berry" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-berry/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-berry">
            <ShieldCheck size={12} />
            <span>{content.badge}</span>
          </span>

          <h2 id="auth-modal-title" className="font-display text-xl sm:text-2xl font-bold text-ink mt-2.5 tracking-tight">
            {content.title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
            {content.subtitle}
          </p>

          {/* Benefits Bullets */}
          <div className="my-5 w-full rounded-2xl border border-berry/10 bg-[#FCF8FA] p-4 text-left space-y-2">
            {content.bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 shrink-0">
                  ✓
                </span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            <GoogleAuthButton
              onSuccess={closeAuthModal}
              className="py-2.5 text-xs sm:text-sm font-semibold"
            />

            <div className="relative my-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200/60" />
              </div>
              <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-slate-400">
                or
              </span>
            </div>

            <Link
              href="/login?redirect=/health/cycle"
              onClick={closeAuthModal}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3F1F36] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-[0.99]"
            >
              <UserCheck size={16} />
              <span>Sign In with Email</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/onboarding?redirect=/health/cycle"
              onClick={closeAuthModal}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
            >
              <span>Get Started with Questionnaire</span>
            </Link>

            <button
              type="button"
              onClick={closeAuthModal}
              className="pt-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Continue exploring as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
