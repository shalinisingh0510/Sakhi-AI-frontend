"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Share2,
  Printer,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { LOCAL_CATALOG } from "@/lib/calculators-api";
import { useAuthStore } from "@/lib/auth-store";
import { useAnonymousTimerStore } from "@/lib/anonymous-timer-store";

interface CalculatorLayoutProps {
  currentSlug: string;
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  howItWorks: React.ReactNode;
  faqList: Array<{ question: string; answer: string }>;
  clinicalDisclaimer?: string;
}

export function CalculatorLayout({
  currentSlug,
  title,
  subtitle,
  badge = "Medically Reviewed",
  children,
  howItWorks,
  faqList,
  clinicalDisclaimer,
}: CalculatorLayoutProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "how-it-works" | "faq">("calculator");
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { isExpired, isPaid, openPaywall } = useAnonymousTimerStore();
  const isAnon = user?.isAnonymous ?? false;

  // Pick 3 related calculators
  const relatedCalculators = LOCAL_CATALOG.filter((c) => c.slug !== currentSlug).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-cream/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-ink/60">
          <Link href="/tools" className="flex items-center gap-1 hover:text-berry transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Calculators</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
          <span className="text-berry font-semibold truncate max-w-xs">{title}</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-8 rounded-3xl bg-white/90 p-6 sm:p-8 shadow-sm border border-peach/50 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blush/60 px-3 py-1 text-xs font-semibold text-berry">
                <ShieldCheck className="h-3.5 w-3.5 text-berry" />
                <span>{badge}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
                {title}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-ink/70">
                {subtitle}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-peach bg-white px-3.5 py-2 text-xs font-medium text-ink shadow-2xs hover:bg-blush/20 transition-all"
                title="Copy share link"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-moss" /> : <Share2 className="h-4 w-4 text-berry" />}
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-peach bg-white px-3.5 py-2 text-xs font-medium text-ink shadow-2xs hover:bg-blush/20 transition-all"
                title="Print results"
              >
                <Printer className="h-4 w-4 text-berry" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="mt-6 flex border-b border-peach/60 gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "calculator"
                  ? "border-berry text-berry font-semibold"
                  : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("how-it-works")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "how-it-works"
                  ? "border-berry text-berry font-semibold"
                  : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>How It Works</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faq")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "faq"
                  ? "border-berry text-berry font-semibold"
                  : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Medical FAQs ({faqList.length})</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "calculator" && (
            <div className="transition-all duration-300">
              {isAnon && isExpired && !isPaid && (
                <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-200 text-rose-800 shrink-0">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">10-Minute Anonymous Trial Expired</p>
                      <p className="text-rose-700">Unlock unlimited calculator predictions and AI chat with Anonymous Pro.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openPaywall}
                    className="shrink-0 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>Unlock Unlimited (₹99 / $1.99)</span>
                  </button>
                </div>
              )}
              {children}
            </div>
          )}

          {activeTab === "how-it-works" && (
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-peach/50 space-y-4">
              <h2 className="font-display text-xl font-bold text-berry flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-berry" />
                <span>Clinical Methodology & Biology</span>
              </h2>
              <div className="prose prose-sm max-w-none text-ink/80 leading-relaxed">
                {howItWorks}
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-peach/50 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-berry flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-berry" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Reviewed by women&apos;s health specialists and aligned with ACOG standards.
                </p>
              </div>

              <div className="divide-y divide-peach/40">
                {faqList.map((faq, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                    <h3 className="text-sm font-semibold text-ink flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush text-xs font-bold text-berry">
                        {idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="pl-7 text-xs sm:text-sm text-ink/75 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Disclaimer Alert */}
          <div className="rounded-2xl bg-peach/25 border border-peach/60 p-4 sm:p-5 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-berry shrink-0 mt-0.5" />
            <div className="text-xs text-ink/75 space-y-1">
              <p className="font-semibold text-ink">Medical Information & Clinical Disclaimer</p>
              <p>
                {clinicalDisclaimer ||
                  "The calculators and information provided by Sakhi AI are intended solely for educational and informational purposes. They do not constitute formal medical diagnosis, obstetrical advice, or treatment plans. Always consult your qualified OB/GYN, midwife, or reproductive endocrinologist for clinical diagnosis and care."}
              </p>
            </div>
          </div>

          {/* Related Calculators Shelf */}
          <div className="pt-6 border-t border-peach/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-ink">
                Other Helpful Health Calculators
              </h2>
              <Link href="/tools" className="text-xs font-semibold text-berry hover:underline flex items-center gap-1">
                <span>View all 10 tools</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCalculators.map((c) => (
                <Link
                  key={c.id}
                  href={`/tools/${c.slug}`}
                  className="group rounded-2xl bg-white p-4 border border-peach/50 shadow-2xs hover:shadow-md hover:border-berry/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="inline-flex rounded-full bg-blush/60 px-2 py-0.5 text-[10px] font-semibold text-berry uppercase tracking-wider">
                      {c.category}
                    </div>
                    <h3 className="font-display text-sm font-bold text-ink group-hover:text-berry transition-colors">
                      {c.short_title}
                    </h3>
                    <p className="text-xs text-ink/65 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-xs font-medium text-berry gap-1">
                    <span>Try calculator</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
