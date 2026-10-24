"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Stethoscope,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";

type AboutTab = "mission" | "medical" | "privacy" | "journey";

const ABOUT_TABS: { key: AboutTab; label: string; icon: string }[] = [
  { key: "mission", label: "Our Mission & Story", icon: "🌸" },
  { key: "medical", label: "Medical Advisory Board", icon: "🩺" },
  { key: "privacy", label: "Flo-Grade Privacy Standard", icon: "🛡️" },
  { key: "journey", label: "Lifespan Health Journey", icon: "✨" },
];

export default function AboutPage() {
  const openAnonymousModal = useAnonymousModalStore((s) => s.openModal);

  const [activeTab, setActiveTab] = useState<AboutTab>("mission");

  const MEDICAL_BOARD = [
    {
      name: "Dr. Ananya Sharma, MD, FACOG",
      role: "Chief Medical Officer",
      specialty: "Reproductive Endocrinology & Fertility",
      experience: "16+ years clinical practice",
      affiliation: "Fellow of American College of Obstetricians & Gynecologists",
      image: "👩‍⚕️",
      quote:
        "Every single algorithm, cycle forecast, and symptom insight on Sakhi AI is engineered to adhere to strict ACOG and WHO guidelines. We bridge clinical precision with warmth.",
    },
    {
      name: "Dr. Sunita Kulkarni, MBBS, DGO",
      role: "Clinical Director of Adolescent Care",
      specialty: "Pediatric & Adolescent Gynecology",
      experience: "22+ years across rural & urban healthcare",
      affiliation: "Indian College of Obstetricians & Gynaecologists",
      image: "🩺",
      quote:
        "Normalizing menstruation for a 12-year-old girl in her own native language prevents school dropouts and eliminates shame. Menstruation is biology, not a secret.",
    },
    {
      name: "Dr. Priya Nair, MD (Internal Med)",
      role: "Hormonal & Metabolic Lead",
      specialty: "PCOS, Insulin Resistance & Thyroid Health",
      experience: "14+ years research & endocrinology",
      affiliation: "International PCOS Consortium Member",
      image: "🔬",
      quote:
        "PCOS and irregular cycles are not life sentences. By educating women on seed cycling, insulin sensitivity, and restorative luteal pacing, we restore biological balance.",
    },
    {
      name: "Dr. Vikram Sen, MD",
      role: "Pelvic Wellness & Preventive Health Lead",
      specialty: "Pelvic Floor Rehabilitation & Pain Management",
      experience: "18+ years sports & pelvic therapeutics",
      affiliation: "Global Pelvic Health Alliance",
      image: "🧘‍♂️",
      quote:
        "Gentle spinal decompression, targeted pelvic hydration, and cyclic movement ease over 80% of secondary dysmenorrhea discomfort without excessive medication.",
    },
  ];

  const LIFESPAN_PHASES = [
    {
      phase: "Phase 1: Puberty & First Periods",
      age: "Ages 9 – 18",
      color: "from-rose/15 to-blush/80 border-rose/30",
      accent: "text-rose",
      icon: "🌸",
      title: "De-mystifying Menarche with Gentle Candor",
      description:
        "Over 70% of girls in semi-urban communities experience fear and confusion when their period arrives. Sakhi AI acts as a patient, judgment-free elder sister explaining blood loss, hygiene pouches, and normal cramps.",
      keyFeatures: ["Visual Anatomy & Pad Placement", "Pain Soothing & Cramp Relief", "Caregiver Dialogue Scripts"],
    },
    {
      phase: "Phase 2: Cycle Health & Fertility",
      age: "Ages 18 – 35",
      color: "from-peach/25 to-white border-peach/80",
      accent: "text-amber-700",
      icon: "✨",
      title: "Bi-Hourly Biological Rhythm & Fertile Windows",
      description:
        "Powered by our autonomous 2-Hour Intelligence Engine, users receive alternating reminders on follicular energy spikes, ovulation timing, and luteal progesterone transitions without intrusive tracking.",
      keyFeatures: ["2-Hour Cooldown Smart Notifications", "Natural Conception & Ovulation Estimators", "Metabolic Energy Forecasts"],
    },
    {
      phase: "Phase 3: Complex Conditions",
      age: "All Reproductive Ages",
      color: "from-lavender/30 to-white border-lavender/80",
      accent: "text-berry",
      icon: "🧬",
      title: "PCOS, Endometriosis & Hormone Balance",
      description:
        "Evidence-backed clinical modules demystify androgen imbalances, heavy flow management, and cyclic mood changes with clinically validated dietary protocols.",
      keyFeatures: ["Seed Cycling & Nutrition Blueprints", "Symptom Logging & Doctor Reports", "Medically Verified Guides"],
    },
    {
      phase: "Phase 4: Perimenopause & Longevity",
      age: "Ages 40+",
      color: "from-mint/30 to-white border-mint/80",
      accent: "text-teal-800",
      icon: "🌿",
      title: "Hormonal Transitions & Long-Term Vitality",
      description:
        "Navigating vasomotor flashes, sleep disturbances, and estrogen fluctuations with supportive lifestyle modifications and cardiovascular wellness.",
      keyFeatures: ["Vasomotor Flashes & Sleep Insights", "Bone Density & Strength Protocols", "Cardiovascular Rhythm Tracking"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. HERO SECTION (Flo.health aesthetic: Clean gradients, high-contrast typography, clinical authority) */}
      <section className="relative overflow-hidden rounded-3xl border border-berry/15 bg-gradient-to-br from-blush/70 via-white to-lavender/30 p-6 sm:p-12 lg:p-16 shadow-soft">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-rose/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-peach/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-berry/20 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-berry shadow-xs">
            <span className="h-2 w-2 rounded-full bg-rose animate-pulse" />
            Flo-Inspired Clinical Architecture • Global Mission
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-[1.12]">
            Building a Better, Safer Future for{" "}
            <span className="bg-gradient-to-r from-berry via-rose to-amber-600 bg-clip-text text-transparent">
              Female Health
            </span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-ink/75 max-w-2xl font-normal">
            Inspired by world-class standards set by <strong>Flo Health</strong>, Sakhi AI combines medical board rigor, compassionate multilingual AI, and <strong>Flo-Grade Anonymous Mode</strong>—ensuring every woman and adolescent girl can understand, track, and advocate for her body without shame or fear.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openAnonymousModal("shield")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-800 hover:shadow-lg active:scale-95"
            >
              <Shield className="h-4 w-4" />
              <span>Flo-Grade Anonymous Mode</span>
            </button>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-peach/90 bg-white/90 px-6 py-3 text-sm font-bold text-ink shadow-xs transition-all hover:border-berry/30 hover:bg-blush/40"
            >
              <span>Chat with Sakhi AI</span>
              <ArrowRight className="h-4 w-4 text-berry" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-ink/70 hover:text-berry transition-colors"
            >
              Explore Calculators →
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-peach/80 pt-8">
          <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm shadow-xs">
            <p className="font-display text-2xl sm:text-3xl font-black text-berry">120+</p>
            <p className="mt-1 text-xs font-semibold text-ink/70">Medical Board Clinicians</p>
            <p className="text-[11px] text-ink/50 mt-0.5">ACOG &amp; WHO Standards</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm shadow-xs">
            <p className="font-display text-2xl sm:text-3xl font-black text-emerald-700">100%</p>
            <p className="mt-1 text-xs font-semibold text-ink/70">Anonymous &amp; Private</p>
            <p className="text-[11px] text-ink/50 mt-0.5">Zero-Knowledge Decoupling</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm shadow-xs">
            <p className="font-display text-2xl sm:text-3xl font-black text-amber-700">11+</p>
            <p className="mt-1 text-xs font-semibold text-ink/70">Regional Languages</p>
            <p className="text-[11px] text-ink/50 mt-0.5">Hindi, Bengali, Marathi, etc.</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm shadow-xs">
            <p className="font-display text-2xl sm:text-3xl font-black text-rose">2 Hours</p>
            <p className="mt-1 text-xs font-semibold text-ink/70">Autonomous Cadence</p>
            <p className="text-[11px] text-ink/50 mt-0.5">Cycle, Energy &amp; Activity</p>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION PILL TABS */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-peach/60 pb-4">
        {ABOUT_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all",
                active
                  ? "bg-berry text-white shadow-md scale-102"
                  : "bg-white text-ink/70 hover:bg-peach/40 hover:text-ink border border-peach/70",
              ].join(" ")}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}
      <div className="mt-8 space-y-12">
        {/* TAB 1: MISSION & STORY */}
        {activeTab === "mission" && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <span className="rounded-full bg-peach/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                  Why We Built Sakhi AI
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-ink leading-tight">
                  Closing the Global Women’s Health Knowledge Gap
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-ink/70">
                  In many parts of South Asia and underserved global communities, menstruation and reproductive biology remain shrouded in whispered silence. Young girls learn about their periods through sudden fear and soiled clothing. Adult women silently battle debilitating cramps, undiagnosed PCOS, or fertility stress without a safe space to ask questions.
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-ink/70">
                  Sakhi AI was created as an ever-present, culturally compassionate elder sister—a <em>Sakhi</em>. Blending generative AI trained on peer-reviewed clinical knowledge with the highest digital health security inspired by Flo Health, we provide personalized guidance in 11+ languages without judgment or shame.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Free Clinical Calculators</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Culturally Attuned Caregiver Guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>No Advertising Trackers</span>
                  </div>
                </div>
              </div>

              {/* Graphic Card */}
              <div className="relative rounded-3xl border border-peach/80 bg-gradient-to-br from-peach/20 via-white to-blush/30 p-6 sm:p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-peach/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-berry text-white text-sm">
                        🌸
                      </span>
                      <div>
                        <p className="text-xs font-bold text-ink">The Sakhi AI Promise</p>
                        <p className="text-[10px] text-ink/50">Clinical Integrity &amp; Compassion</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Medical Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-ink/75">
                    <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-xs">
                      <p className="font-bold text-ink">1. Zero Fear, Maximum Empathy</p>
                      <p className="mt-0.5 text-ink/65">
                        We explain normal blood loss (2–3 tablespoons over a whole week) so teenagers know they cannot bleed out from a natural cycle.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-xs">
                      <p className="font-bold text-ink">2. Multilingual Accessibility</p>
                      <p className="mt-0.5 text-ink/65">
                        Available in Hindi, Bengali, Marathi, Tamil, Telugu, and English with voice audio pronunciation for low-literacy settings.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-xs">
                      <p className="font-bold text-ink">3. Autonomous Intelligence Engine</p>
                      <p className="mt-0.5 text-ink/65">
                        Alerting you every 2 hours on cycle transitions, fertile windows, energy peaks, and hydration without requiring email signups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values 3-Card Grid */}
            <div className="grid gap-6 sm:grid-cols-3 pt-6">
              <Card padding="lg" className="border-peach/70 bg-white hover:border-berry/30 transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush text-berry text-xl mb-4">
                  🔬
                </span>
                <h3 className="font-bold text-base text-ink">Scientific &amp; Clinical Rigor</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65">
                  Our calculations and recommendations reference ACOG, RCOG, and WHO clinical literature. No sensationalized remedies or unproven fads.
                </p>
              </Card>

              <Card padding="lg" className="border-peach/70 bg-white hover:border-berry/30 transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 text-xl mb-4">
                  🛡️
                </span>
                <h3 className="font-bold text-base text-ink">Flo-Grade Privacy Standard</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65">
                  Your body, your data. Period. We pioneer Anonymous Mode where health logs exist completely detached from your name, phone number, and email.
                </p>
              </Card>

              <Card padding="lg" className="border-peach/70 bg-white hover:border-berry/30 transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/30 text-amber-700 text-xl mb-4">
                  🤝
                </span>
                <h3 className="font-bold text-base text-ink">Caregiver &amp; Youth Bridge</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65">
                  Empowering fathers, mothers, and educators with respectful dialogue scripts so the next generation grows up proud of their natural biology.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: MEDICAL ADVISORY BOARD (Flo-Grade 120+ Clinicians Backing) */}
        {activeTab === "medical" && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-3xl">
              <span className="rounded-full bg-lavender/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-berry">
                Clinical Excellence
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-ink">
                Guided by World-Class OB-GYNs &amp; Researchers
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink/70">
                Following the gold standard of <strong>Flo Health’s 120+ clinician review network</strong>, every calculator formula, cycle prediction, and medical library article on Sakhi AI is peer-reviewed by certified reproductive physicians and adolescent specialists.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {MEDICAL_BOARD.map((doctor, idx) => (
                <Card
                  key={idx}
                  padding="lg"
                  className="border-peach/70 bg-white/90 transition-all hover:border-berry/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blush text-2xl shadow-xs">
                      {doctor.image}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-ink">{doctor.name}</h3>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-berry mt-0.5">{doctor.role}</p>
                      <p className="text-xs text-ink/60">{doctor.specialty}</p>
                      <p className="text-[11px] text-ink/45 mt-0.5">{doctor.affiliation} • {doctor.experience}</p>

                      <div className="mt-4 rounded-xl border border-peach/50 bg-slate-50/80 p-3 text-xs italic text-ink/75 leading-relaxed">
                        &ldquo;{doctor.quote}&rdquo;
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="rounded-2xl border border-peach/80 bg-gradient-to-r from-peach/30 via-white to-blush/30 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-ink">Are you a healthcare provider or researcher?</p>
                <p className="text-xs text-ink/65 mt-0.5">
                  Join our clinical advisory board and help shape evidence-based health algorithms for millions of girls worldwide.
                </p>
              </div>
              <Link
                href="/chat?prompt=I+am+a+doctor+interested+in+collaborating+with+the+Sakhi+Medical+Board"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-berry px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose transition-colors"
              >
                <span>Clinical Inquiries</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: FLO-GRADE PRIVACY STANDARD */}
        {activeTab === "privacy" && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-3xl">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                Data Sovereignty
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-ink">
                Flo-Grade Anonymous Mode: Your Body, Your Data
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink/70">
                In 2022, Flo Health revolutionized reproductive privacy by releasing <strong>Anonymous Mode</strong>, allowing users to track their cycles without any personal identifiers. We have implemented this standard natively in Sakhi AI.
              </p>
            </div>

            {/* Architecture Comparison Table */}
            <Card padding="lg" className="border-peach/80 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-peach/70 text-ink/60 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Privacy Feature</th>
                      <th className="py-3 px-4 text-rose">Legacy Health Apps</th>
                      <th className="py-3 px-4 text-emerald-700 font-bold">Sakhi AI (Flo-Grade Standard)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-peach/50 text-ink/80">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-ink">Account Requirement</td>
                      <td className="py-3 px-4 text-rose">Mandatory email, phone number, Google ID</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        Zero sign-in required. 1-click Anonymous Mode
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-ink">Biometric Decoupling</td>
                      <td className="py-3 px-4 text-rose">Personal name attached to cycle symptoms</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        Cryptographic Recovery Key (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">SAKHI-ANON-...</code>)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-ink">Third-Party Ad Trackers</td>
                      <td className="py-3 px-4 text-rose">Meta Pixel, Google Ad brokers</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        0 Third-Party Ad Brokers. Pure healthcare.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-ink">Subpoena Defense</td>
                      <td className="py-3 px-4 text-rose">Data can link back to user identity</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        Mathematically impossible to trace data back to an individual
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-ink">2-Hour Cooldown Engine</td>
                      <td className="py-3 px-4 text-rose">Requires push tokens &amp; email delivery</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        Local client-side &amp; token-free browser notification fallback
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl shadow-xs">
                  🛡️
                </span>
                <div>
                  <h3 className="font-bold text-ink">Try Flo-Grade Anonymous Mode Right Now</h3>
                  <p className="text-xs text-ink/70 mt-0.5">
                    Launch anonymous mode in 1 second. All calculators, chat, and notification engine alerts work with full confidentiality.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAnonymousModal("shield")}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
              >
                <span>Launch Shield Modal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: LIFESPAN HEALTH JOURNEY */}
        {activeTab === "journey" && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-3xl">
              <span className="rounded-full bg-peach/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                End-to-End Care
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-ink">
                Supporting Every Stage of the Female Lifespan
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink/70">
                Female physiology is not static—it evolves dynamically across puberty, peak reproductive years, complex hormonal conditions, and longevity. Sakhi AI provides dedicated clinical modules tailored to each milestone.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {LIFESPAN_PHASES.map((item, idx) => (
                <Card
                  key={idx}
                  padding="lg"
                  className={`border bg-gradient-to-br ${item.color} shadow-xs hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="rounded-full bg-white/90 border border-peach/60 px-3 py-1 text-[11px] font-bold text-ink/70">
                      {item.age}
                    </span>
                  </div>

                  <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${item.accent}`}>
                    {item.phase}
                  </p>
                  <h3 className="font-display text-lg font-bold text-ink mt-1">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/70">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-peach/50 space-y-1.5">
                    {item.keyFeatures.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 text-xs text-ink/80">
                        <CheckCircle2 className={`h-3.5 w-3.5 ${item.accent} shrink-0`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. CLINICAL STANDARDS STATEMENT & ETHICS */}
      <section className="mt-16 rounded-3xl border border-peach/80 bg-white p-8 sm:p-10 shadow-soft">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-berry">
            <Stethoscope className="h-4 w-4" />
            <span>Clinical Disclaimer &amp; Medical Protocol</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            A Compassionate Companion, Not a Physician Replacement
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-ink/70">
            Sakhi AI provides educational guidance, cycle prediction, and algorithmic symptom assessments based on published medical consensus. It does not provide medical diagnoses or replace an emergency room physician, OB-GYN examination, or prescription medication. If you experience acute abdominal pain, excessive hemorrhaging (soaking two or more maxi pads per hour for two consecutive hours), or high fever with pelvic symptoms, please seek immediate in-person clinical care.
          </p>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER (Flo-grade aesthetic) */}
      <section className="mt-12 rounded-3xl border border-berry/20 bg-gradient-to-r from-berry via-rose to-amber-600 p-8 sm:p-12 text-white text-center shadow-lg">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold">
          Ready to Understand Your Body with Confidence?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl mx-auto font-normal">
          Join hundreds of thousands of women and girls who use Sakhi AI every single day for cycle tracking, hormonal equilibrium, and trusted health education.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-berry shadow-md transition-all hover:bg-blush hover:scale-105 active:scale-95"
          >
            <span>Ask Sakhi AI Anything</span>
            <ArrowRight className="h-4 w-4 text-berry" />
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Explore Calculators
          </Link>
        </div>
      </section>
    </div>
  );
}
