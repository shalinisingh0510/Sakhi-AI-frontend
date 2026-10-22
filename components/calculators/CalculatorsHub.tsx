"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Activity,
  Calendar,
  CalendarDays,
  Baby,
  Clock,
  Microscope,
  ScanLine,
  CheckCircle2,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { LOCAL_CATALOG, type CalculatorMeta } from "@/lib/calculators-api";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Activity,
  CheckCircle2,
  Calendar,
  CalendarDays,
  HeartPulse,
  Baby,
  Clock,
  Microscope,
  ScanLine,
};

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "fertility", label: "Fertility & Ovulation" },
  { id: "pregnancy", label: "Pregnancy & Due Dates" },
  { id: "cycle", label: "Menstrual Cycle" },
  { id: "clinical", label: "Clinical & Labs" },
];

export function CalculatorsHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalculators = useMemo(() => {
    return LOCAL_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short_title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-cream/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush/60 via-peach/40 to-lavender/50 p-8 sm:p-12 border border-peach/70 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-xs font-semibold text-berry shadow-2xs backdrop-blur-sm border border-peach/50">
              <Sparkles className="h-3.5 w-3.5 text-berry" />
              <span>Evidence-Based Health Calculators</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
              Interactive Health &amp; <span className="text-berry">Pregnancy Tools</span>
            </h1>
            <p className="text-base sm:text-lg text-ink/75 leading-relaxed">
              Explore our clinical calculators built to support every phase of your reproductive journey — from ovulation and cycle tracking to pregnancy due dates, beta hCG doubling, and fetal milestones.
            </p>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="rounded-2xl bg-white/70 p-3 border border-peach/40 backdrop-blur-xs">
                <span className="block text-2xl font-bold text-berry">10</span>
                <span className="text-xs text-ink/70">Clinical Calculators</span>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 border border-peach/40 backdrop-blur-xs">
                <span className="block text-2xl font-bold text-berry">ACOG</span>
                <span className="text-xs text-ink/70">Medical Standards</span>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 border border-peach/40 backdrop-blur-xs">
                <span className="block text-2xl font-bold text-berry">100%</span>
                <span className="text-xs text-ink/70">Private &amp; Free</span>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 border border-peach/40 backdrop-blur-xs">
                <span className="block text-2xl font-bold text-berry">24/7</span>
                <span className="text-xs text-ink/70">Instant Insights</span>
              </div>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-rose/20 blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-20 h-64 w-64 rounded-full bg-lavender/40 blur-3xl pointer-events-none" />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Categories Tab Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-berry text-white shadow-xs"
                    : "bg-white text-ink/70 hover:bg-blush/40 hover:text-ink border border-peach/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculators (e.g. ovulation, due date)..."
              className="w-full rounded-full border border-peach/80 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Calculators Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => {
            const Icon = ICON_MAP[calc.icon] || Sparkles;
            return (
              <Link
                key={calc.id}
                href={`/tools/${calc.slug}`}
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-6 border border-peach/60 shadow-2xs hover:shadow-lg hover:border-berry/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush/80 text-berry group-hover:bg-berry group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    {calc.badge && (
                      <span className="rounded-full bg-peach/60 px-3 py-1 text-[11px] font-semibold text-berry">
                        {calc.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-moss">
                      {calc.category}
                    </span>
                    <h2 className="font-display text-lg font-bold text-ink group-hover:text-berry transition-colors mt-0.5 line-clamp-2">
                      {calc.short_title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed line-clamp-3">
                      {calc.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-peach/40 text-xs font-semibold text-berry">
                  <span>Open Calculator</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blush/40 group-hover:bg-berry group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center border border-peach/60 space-y-3">
            <SlidersHorizontal className="mx-auto h-8 w-8 text-ink/30" />
            <h3 className="font-display text-lg font-bold text-ink">No calculators found</h3>
            <p className="text-sm text-ink/60 max-w-sm mx-auto">
              We couldn&apos;t find any tool matching &quot;{searchQuery}&quot;. Try adjusting your search term or selecting &quot;All Tools&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 rounded-full bg-berry px-4 py-2 text-xs font-semibold text-white hover:bg-berry/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Informational Footer Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-peach/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-berry" />
              <span>Medically Reviewed Health Algorithms</span>
            </h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
              Every formula and timeline in our calculators is derived from peer-reviewed gynecological guidelines, including the American College of Obstetricians and Gynecologists (ACOG), the American Society for Reproductive Medicine (ASRM), and standard obstetrical dating protocols.
            </p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 rounded-full bg-berry px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-berry/90 transition-all flex items-center gap-2"
          >
            <span>Ask Sakhi AI Companion</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
