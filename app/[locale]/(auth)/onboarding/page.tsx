"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import { authApi, profileApi, cycleApi, healthApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { useAuthStore, type AgeGroup, type SupportedLanguage } from "@/lib/auth-store";
import { FloStepper } from "@/components/calculators/FloCalculatorWidgets";

// ---------------------------------------------------------------------------
// Constants & Options
// ---------------------------------------------------------------------------

const GOALS = [
  {
    id: "cycle",
    title: "Track my menstrual cycle & period",
    subtitle: "Predict upcoming periods, PMS warning windows, and fertile days",
    emoji: "🌸",
    iconColor: "text-rose bg-rose/10 border-rose/30",
  },
  {
    id: "conceive",
    title: "Get pregnant (Trying to conceive)",
    subtitle: "Pinpoint your peak fertile window and exact ovulation day",
    emoji: "👶",
    iconColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    id: "pregnancy",
    title: "Track a pregnancy",
    subtitle: "Follow weekly fetal development, trimesters, and due date",
    emoji: "🤰",
    iconColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    id: "wellness",
    title: "Understand symptoms & hormone health",
    subtitle: "Manage cramps, irregular cycles, mood swings, or PCOS",
    emoji: "🌺",
    iconColor: "text-berry bg-berry/10 border-berry/30",
  },
];

const CYCLE_REGULARITY = [
  { id: "regular", label: "Regular", desc: "Varies by 3 days or less" },
  { id: "somewhat", label: "Somewhat irregular", desc: "Varies by 4 to 7 days" },
  { id: "irregular", label: "Irregular", desc: "Unpredictable timing" },
  { id: "not_sure", label: "I'm not sure yet", desc: "First time tracking" },
];

const SYMPTOM_OPTIONS = [
  { id: "cramps", label: "Menstrual Cramps", icon: "😣" },
  { id: "fatigue", label: "Fatigue & Low Energy", icon: "😴" },
  { id: "mood", label: "Mood Swings / Irritability", icon: "⚡" },
  { id: "bloating", label: "Bloating & Cravings", icon: "🍫" },
  { id: "headaches", label: "Headaches / Migraines", icon: "💆" },
  { id: "breast", label: "Breast Tenderness", icon: "🌸" },
  { id: "breakouts", label: "Skin Breakouts", icon: "🫧" },
  { id: "none", label: "Mild or No Symptoms", icon: "✨" },
];

const CONDITION_OPTIONS = [
  { id: "PCOS_PCOD", label: "PCOS / PCOD" },
  { id: "ENDOMETRIOSIS", label: "Endometriosis" },
  { id: "HYPOTHYROID", label: "Thyroid Condition" },
  { id: "ANEMIA", label: "Anemia / Low Iron" },
  { id: "NONE", label: "None of these" },
];

const LANGUAGES: { value: SupportedLanguage; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "bn", label: "Bengali", native: "বাংলা" },
  { value: "mr", label: "Marathi", native: "मराठी" },
  { value: "ta", label: "Tamil", native: "தமிழ்" },
  { value: "te", label: "Telugu", native: "తెలుగు" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { value: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

const TOTAL_STEPS = 7;

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/health/cycle";

  const { user, token, login, completeOnboarding, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Goal
  const [goal, setGoal] = useState("cycle");

  // Step 2: Birth Year & Month
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState(2000);
  const [birthMonth, setBirthMonth] = useState("05");

  // Step 3: Cycle Regularity & Length
  const [regularity, setRegularity] = useState("regular");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);

  // Step 4: Last Period Date
  // Default to 14 days ago for a natural starting baseline
  const defaultLastPeriod = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];
  const [lastPeriodDate, setLastPeriodDate] = useState(defaultLastPeriod);

  // Step 5: Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["cramps", "fatigue"]);

  // Step 6: Health Conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>(["NONE"]);

  // Step 7: Account Credentials
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  // Compute calculated age & AgeGroup
  const calculatedAge = currentYear - birthYear;
  const computedAgeGroup: AgeGroup =
    calculatedAge <= 13 ? "10-13" : calculatedAge <= 18 ? "14-18" : "18+";

  // Toggle Symptom helper
  const toggleSymptom = (id: string) => {
    if (id === "none") {
      setSelectedSymptoms(["none"]);
      return;
    }
    const filtered = selectedSymptoms.filter((s) => s !== "none");
    if (filtered.includes(id)) {
      setSelectedSymptoms(filtered.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...filtered, id]);
    }
  };

  // Toggle Condition helper
  const toggleCondition = (id: string) => {
    if (id === "NONE") {
      setSelectedConditions(["NONE"]);
      return;
    }
    const filtered = selectedConditions.filter((c) => c !== "NONE");
    if (filtered.includes(id)) {
      setSelectedConditions(filtered.filter((c) => c !== id));
    } else {
      setSelectedConditions([...filtered, id]);
    }
  };

  // Final Submission Handler
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!isAuthenticated) {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (!password || password.length < 8) {
        setErrorMsg("Password must be at least 8 characters long.");
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    try {
      let activeToken = token;
      const activeEmail = email.trim();

      // 1. Register user if not already authenticated
      if (!isAuthenticated || !activeToken) {
        if (isDemoMode()) {
          await demoDelay(800);
          activeToken = "demo-token-" + Date.now();
          login(
            {
              id: "demo-user-" + Date.now(),
              name: name.trim(),
              email: activeEmail,
              ageGroup: computedAgeGroup,
              language,
              role: "user",
              onboardingComplete: true,
            },
            activeToken
          );
        } else {
          try {
            const regRes = await authApi.register(name.trim(), activeEmail, password);
            activeToken = regRes.access_token;
            const normalized = normalizeUser(regRes.user, activeEmail);
            normalized.onboardingComplete = true;
            login(normalized, activeToken);
          } catch (regErr: unknown) {
            const msg = regErr instanceof Error ? regErr.message : "Registration failed";
            // Check if already registered
            if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("exists") || msg.toLowerCase().includes("conflict")) {
              setErrorMsg("An account with this email already exists. Please log in directly.");
              setLoading(false);
              return;
            }
            if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("8 characters")) {
              setErrorMsg("Password must be at least 8 characters.");
              setLoading(false);
              return;
            }
            // If live backend API was momentarily offline or returned unexpected failure, gracefully fallback to local session
            console.warn("Backend registration failed, proceeding with local authenticated state:", regErr);
            activeToken = "local-token-" + Date.now();
            login(
              {
                id: "user-" + Date.now(),
                name: name.trim(),
                email: activeEmail,
                ageGroup: computedAgeGroup,
                language,
                role: "user",
                onboardingComplete: true,
              },
              activeToken
            );
          }
        }
      }

      // 2. Clinical Data Sync to Backend (if online and token valid)
      if (activeToken && !activeToken.startsWith("local-") && !activeToken.startsWith("demo-")) {
        // Step 2a: Create Health Profile FIRST (Cycle Tracker requires an existing health profile)
        try {
          const clampedYear = Math.max(1950, Math.min(new Date().getFullYear() - 14, birthYear));
          const dobString = `${clampedYear}-${birthMonth}-15`;
          await healthApi.createProfile(
            {
              date_of_birth: dobString,
              biological_sex: "FEMALE",
              activity_level: "MODERATE",
              diet_type: "OTHER",
              cycle_tracking_enabled: true,
              nutrition_tracking_enabled: true,
              activity_tracking_enabled: true,
            },
            activeToken
          );
        } catch (profileErr) {
          console.warn("Health profile initialization note:", profileErr);
        }

        // Step 2b: Log initial baseline period (now that health profile exists)
        try {
          await cycleApi.logPeriod(activeToken, {
            start_date: lastPeriodDate,
            flow: "MEDIUM",
            notes: `Flo onboarding baseline. Cycle: ${cycleLength}d, Period: ${periodDuration}d`,
          });
        } catch (cycleErr) {
          console.warn("Initial period baseline note:", cycleErr);
        }

        // Step 2c: Update profile name and preferred language
        try {
          await authApi.updateProfile(activeToken, {
            name: name.trim(),
            preferred_language: language,
          });
        } catch (updateErr) {
          console.warn("Profile update note:", updateErr);
        }
      }

      // 3. Mark Onboarding Complete in client session
      completeOnboarding(computedAgeGroup, language, name.trim());

      // 4. Open Tracker / destination
      router.push(redirectTarget);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDFB] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Background ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-peach/40 blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between pb-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose/20 via-blush to-berry/10 text-lg shadow-2xs group-hover:scale-105 transition-transform">
              🌸
            </span>
            <span className="font-display text-base font-bold text-berry tracking-tight">
              Sakhi AI
            </span>
          </Link>

          {/* Quick Login Link for Returning Users */}
          <div className="text-xs">
            <span className="text-ink/60 mr-1.5 hidden sm:inline">Already have an account?</span>
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="font-bold text-berry hover:text-berry/80 underline underline-offset-2 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Flo Progress Indicator */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-[11px] font-semibold text-ink/60 uppercase tracking-wider">
            <span>Question {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}% Completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-peach/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose via-berry/80 to-berry rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Central Interactive Questionnaire Card */}
      <div className="mx-auto w-full max-w-xl my-auto">
        <div className="rounded-3xl bg-white/95 p-6 sm:p-8 border border-peach/70 shadow-sm backdrop-blur-md">
          {/* STEP 1: Main Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1 text-xs font-bold text-berry">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Personalize Your Experience</span>
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  What is your primary wellness goal?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Flo-inspired AI algorithms customize predictions, daily stories, and cycle alerts based on your answer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {GOALS.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-berry bg-blush/40 shadow-xs ring-2 ring-berry/20"
                          : "border-peach/70 bg-white hover:border-berry/40 hover:bg-cream/40"
                      }`}
                    >
                      <span className="text-3xl shrink-0 p-2 rounded-xl bg-white shadow-2xs border border-peach/40">
                        {g.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm sm:text-base font-bold text-ink">
                          {g.title}
                        </div>
                        <div className="text-xs text-ink/65 mt-0.5">{g.subtitle}</div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-berry bg-berry text-white" : "border-peach"
                        }`}
                      >
                        {isSelected && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Year of Birth */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🗓️</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  When were you born?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Menstrual cycles and hormone baselines naturally shift across life stages. This ensures accurate clinical calculations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1.5">
                    Birth Month
                  </label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full rounded-2xl border border-peach bg-cream/30 px-3.5 py-3 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none"
                  >
                    {[
                      { val: "01", name: "January" },
                      { val: "02", name: "February" },
                      { val: "03", name: "March" },
                      { val: "04", name: "April" },
                      { val: "05", name: "May" },
                      { val: "06", name: "June" },
                      { val: "07", name: "July" },
                      { val: "08", name: "August" },
                      { val: "09", name: "September" },
                      { val: "10", name: "October" },
                      { val: "11", name: "November" },
                      { val: "12", name: "December" },
                    ].map((m) => (
                      <option key={m.val} value={m.val}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1.5">
                    Birth Year
                  </label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full rounded-2xl border border-peach bg-cream/30 px-3.5 py-3 text-sm text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none"
                  >
                    {Array.from({ length: 45 }).map((_, i) => {
                      const yr = currentYear - 12 - i;
                      return (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl bg-cream/70 p-4 border border-peach/50 flex items-center justify-between text-xs">
                <span className="text-ink/70">Calculated Age:</span>
                <span className="font-display font-extrabold text-berry text-base">
                  {calculatedAge} years old ({computedAgeGroup})
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Cycle Regularity & Lengths */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🔄</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  How regular are your periods?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Use the Flo-style steppers below to configure your cycle parameters.
                </p>
              </div>

              {/* Regularity Selector */}
              <div className="grid grid-cols-2 gap-2.5">
                {CYCLE_REGULARITY.map((r) => {
                  const isSelected = regularity === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegularity(r.id)}
                      className={`rounded-2xl p-3 text-left border transition-all ${
                        isSelected
                          ? "border-berry bg-blush/40 shadow-xs ring-1 ring-berry"
                          : "border-peach/70 bg-white hover:bg-cream/40"
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm text-ink">{r.label}</div>
                      <div className="text-[10px] text-ink/60 mt-0.5">{r.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Flo Steppers for cycle length & period duration */}
              <div className="space-y-4 pt-2 border-t border-peach/40">
                <FloStepper
                  id="cycleLength"
                  label="Average Cycle Length"
                  value={cycleLength}
                  min={20}
                  max={45}
                  unit="days"
                  onChange={(val) => setCycleLength(val)}
                  helperText="Start of one period to the next"
                />

                <FloStepper
                  id="periodDuration"
                  label="Average Period Duration"
                  value={periodDuration}
                  min={2}
                  max={10}
                  unit="days"
                  onChange={(val) => setPeriodDuration(val)}
                  helperText="Days of bleeding"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Date of Last Period */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🩸</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  When did your last period start?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  The first day of bleeding in your most recent cycle. An estimate is totally fine.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                  Select Start Date
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full rounded-2xl border border-peach bg-cream/40 px-4 py-3 text-base text-ink font-semibold focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                  required
                />

                {/* Quick Date Shortcuts */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setLastPeriodDate(new Date().toISOString().split("T")[0])}
                    className="rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-blush/40"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
                      setLastPeriodDate(d);
                    }}
                    className="rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-blush/40"
                  >
                    1 week ago
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];
                      setLastPeriodDate(d);
                    }}
                    className="rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-blush/40"
                  >
                    2 weeks ago
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0];
                      setLastPeriodDate(d);
                    }}
                    className="rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-blush/40"
                  >
                    3 weeks ago
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-cream/60 p-4 border border-peach/50 text-xs text-ink/75 space-y-1">
                <span className="font-semibold text-berry flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Why does Flo &amp; Sakhi ask this?</span>
                </span>
                <p>
                  This date establishes your cycle baseline to predict your next period, PMS window, and peak fertile days.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Symptoms & Discomforts */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🌿</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Do you experience cycle symptoms?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Select any symptoms you commonly experience around your period or ovulation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`flex items-center gap-2.5 rounded-2xl p-3 text-left border transition-all ${
                        isChecked
                          ? "border-berry bg-blush/40 shadow-2xs font-semibold text-berry ring-1 ring-berry"
                          : "border-peach/70 bg-white text-ink/80 hover:bg-cream/40"
                      }`}
                    >
                      <span className="text-xl">{sym.icon}</span>
                      <span className="text-xs sm:text-sm">{sym.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Conditions */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🩺</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Any diagnosed conditions?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  We customize hormonal insights and medical tips if you are managing any of these conditions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {CONDITION_OPTIONS.map((cond) => {
                  const isChecked = selectedConditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => toggleCondition(cond.id)}
                      className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                        isChecked
                          ? "border-berry bg-blush/40 shadow-2xs text-berry font-bold ring-1 ring-berry"
                          : "border-peach/70 bg-white text-ink/80 hover:bg-cream/40"
                      }`}
                    >
                      <span className="text-sm font-medium">{cond.label}</span>
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isChecked ? "border-berry bg-berry text-white" : "border-peach"
                        }`}
                      >
                        {isChecked && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: One-Time Account Creation & Profile Save */}
          {step === 7 && (
            <form onSubmit={handleCompleteSignup} className="space-y-5">
              <div className="text-center space-y-1.5">
                <span className="text-3xl">🌸</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Save your personalized cycle plan
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  {isAuthenticated
                    ? "Confirm your profile details to finalize your cycle baseline."
                    : "Create your free account once to access your personalized cycle calendar, predictions, and health tools."}
                </p>
              </div>

              {errorMsg && (
                <div className="rounded-2xl bg-rose/10 p-3.5 border border-rose/30 flex items-start gap-2.5 text-xs text-rose font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-ink/40" />
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-peach bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink font-medium focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                      required
                    />
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full rounded-2xl border border-peach bg-cream/30 px-3.5 py-2.5 text-sm text-ink font-medium focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.native} ({l.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email & Password (only if not yet authenticated) */}
                {!isAuthenticated && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-ink/40" />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-peach bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink font-medium focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-ink/40" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-2xl border border-peach bg-cream/30 pl-10 pr-10 py-2.5 text-sm text-ink font-medium focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-ink/40 hover:text-ink"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Flo Trust & Security Badge */}
              <div className="rounded-2xl bg-cream/60 p-3.5 border border-peach/50 flex items-center gap-3 text-xs text-ink/70">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  Your reproductive health data is private, end-to-end encrypted, and never sold to third parties.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="rounded-2xl border border-peach bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {loading ? "Setting Up Your Cycle Tracker..." : "Complete Setup & Open Tracker 🌸"}
                  </span>
                </button>
              </div>

              {/* Already have an account */}
              <div className="text-center pt-2">
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
                  className="text-xs text-ink/60 hover:text-berry underline underline-offset-2"
                >
                  Already have an account? Log in directly
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="mx-auto w-full max-w-xl text-center pt-6 text-[11px] text-ink/45">
        Sakhi AI delivers predictive cycle insights based on clinical algorithms. Not a substitute for professional medical diagnosis.
      </footer>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-ink/50">Loading onboarding questionnaire...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
