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
  Calendar,
  Heart,
  Baby,
  Zap,
  Check,
} from "lucide-react";
import { useAuthStore, type SupportedLanguage, type AgeGroup } from "@/lib/auth-store";
import {
  authApi,
  cycleApi,
  healthApi,
} from "@/lib/api";
import { isDemoMode, normalizeUser } from "@/lib/api-config";

// Preset Language List
const LANGUAGES: { value: SupportedLanguage; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिंदी" },
  { value: "bn", label: "Bengali", native: "বাংলা" },
  { value: "mr", label: "Marathi", native: "मराठी" },
  { value: "ta", label: "Tamil", native: "தமிழ்" },
  { value: "te", label: "Telugu", native: "తెలుగు" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { value: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

const TOTAL_STEPS = 11;

// Reusable Flo Stepper
function FloStepper({
  value,
  min,
  max,
  unit,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-peach/70 bg-white/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink/70">
          {label}
        </span>
        <span className="text-xs font-bold text-berry">
          {value} {unit}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-peach bg-cream/50 text-xl font-bold text-ink hover:bg-cream disabled:opacity-30 active:scale-95 transition-all shadow-2xs"
          aria-label={`Decrease ${label}`}
        >
          –
        </button>

        <div className="flex flex-col items-center">
          <span className="font-display text-4xl font-extrabold text-ink tracking-tight">
            {value}
          </span>
          <span className="text-[11px] font-medium text-ink/50 uppercase tracking-widest mt-0.5">
            {unit}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-peach bg-cream/50 text-xl font-bold text-ink hover:bg-cream disabled:opacity-30 active:scale-95 transition-all shadow-2xs"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/health/tracker";

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

  // Step 3: Regularity
  const [regularity, setRegularity] = useState("regular");

  // Step 4: Cycle Length & Period Duration
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);

  // Step 5: Last Period Date
  const defaultLastPeriod = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];
  const [lastPeriodDate, setLastPeriodDate] = useState(defaultLastPeriod);

  // Step 6: Flow & Cramp Severity
  const [flowLevel, setFlowLevel] = useState("MEDIUM");
  const [crampSeverity, setCrampSeverity] = useState("moderate");

  // Step 7: Physical PMS Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["cramps", "bloating"]);

  // Step 8: Mood & Emotional Well-being
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["calm", "mood_swings"]);

  // Step 9: Sleep & Daily Stress
  const [sleepDuration, setSleepDuration] = useState("6-8");
  const [stressLevel, setStressLevel] = useState("moderate");

  // Step 10: Health Conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>(["NONE"]);

  // Step 11: Account Credentials
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  // Age calculations
  const calculatedAge = currentYear - birthYear;
  const computedAgeGroup: AgeGroup =
    calculatedAge <= 13 ? "10-13" : calculatedAge <= 18 ? "14-18" : "18+";

  // Helpers for multi-select
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

  const toggleMood = (id: string) => {
    if (selectedMoods.includes(id)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== id));
    } else {
      setSelectedMoods([...selectedMoods, id]);
    }
  };

  const toggleCondition = (id: string) => {
    if (id === "NONE") {
      setSelectedConditions(["NONE"]);
      return;
    }
    const filtered = selectedConditions.filter((c) => c !== "NONE");
    if (filtered.includes(id)) {
      const next = filtered.filter((c) => c !== id);
      setSelectedConditions(next.length === 0 ? ["NONE"] : next);
    } else {
      setSelectedConditions([...filtered, id]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      let activeToken = token;
      const activeEmail = email.trim();

      // 1. Register user if not already authenticated
      if (!isAuthenticated || !activeToken) {
        if (isDemoMode()) {
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
            if (
              msg.toLowerCase().includes("already registered") ||
              msg.toLowerCase().includes("exists") ||
              msg.toLowerCase().includes("conflict")
            ) {
              setErrorMsg("An account with this email already exists. Please click 'Log in directly' below.");
              setLoading(false);
              return;
            }
            if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("8 characters")) {
              setErrorMsg("Password must be at least 8 characters.");
              setLoading(false);
              return;
            }
            console.warn("Backend registration fallback to local state:", regErr);
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

      // 2. Sync clinical data to backend (if token valid)
      if (activeToken && !activeToken.startsWith("local-") && !activeToken.startsWith("demo-")) {
        // Step 2a: Create Health Profile first
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
          console.warn("Health profile note:", profileErr);
        }

        // Step 2b: Log initial baseline period
        try {
          await cycleApi.logPeriod(activeToken, {
            start_date: lastPeriodDate,
            flow: flowLevel,
            notes: `Flo questionnaire baseline. Cycle: ${cycleLength}d, Period: ${periodDuration}d, Cramps: ${crampSeverity}`,
          });
        } catch (cycleErr) {
          console.warn("Period baseline note:", cycleErr);
        }

        // Step 2c: Update profile name & language
        try {
          await authApi.updateProfile(activeToken, {
            name: name.trim(),
            preferred_language: language,
          });
        } catch (updateErr) {
          console.warn("Profile update note:", updateErr);
        }
      }

      // 3. Mark complete in local auth store
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

      {/* Header with Step Counter & Progress Bar */}
      <header className="mx-auto w-full max-w-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-peach/70 bg-white/80 text-ink/70 hover:bg-white hover:text-ink transition-all shadow-2xs"
                aria-label="Previous question"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-berry">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
            className="text-xs font-semibold text-ink/65 hover:text-berry underline underline-offset-2 transition-colors"
          >
            Already have an account? Log In
          </Link>
        </div>

        {/* Multi-segment progress bar */}
        <div className="flex gap-1 h-1.5 w-full overflow-hidden rounded-full bg-peach/30">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-300 rounded-full ${
                i + 1 <= step ? "bg-berry shadow-2xs" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Questionnaire Card Container */}
      <div className="mx-auto my-auto w-full max-w-xl py-6">
        <div className="rounded-3xl border border-peach/70 bg-white/95 p-6 sm:p-10 shadow-sm backdrop-blur-md">
          {/* STEP 1: Primary Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Personalized Flo Experience
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  What brings you to Sakhi AI today?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  We customize your daily insights and cycle calculations based on your current health focus.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    id: "cycle",
                    title: "Track Cycle & Period",
                    desc: "Accurate prediction of next period, PMS, and fertile window.",
                    icon: Calendar,
                    badge: "Most Popular",
                  },
                  {
                    id: "ttc",
                    title: "Trying to Conceive",
                    desc: "Pinpoint ovulation peak and highest fertility days.",
                    icon: Heart,
                    badge: "High Accuracy",
                  },
                  {
                    id: "pregnancy",
                    title: "Track Pregnancy",
                    desc: "Week-by-week baby growth and trimester milestones.",
                    icon: Baby,
                    badge: "Guided Tour",
                  },
                  {
                    id: "hormones",
                    title: "Hormones & Symptoms",
                    desc: "Understand PMS, mood changes, cramps, and energy dips.",
                    icon: Zap,
                    badge: "Full Health",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
                        isSelected
                          ? "border-berry bg-blush/30 shadow-xs"
                          : "border-peach/50 bg-cream/20 hover:border-peach hover:bg-white"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isSelected ? "bg-berry text-white" : "bg-peach/30 text-berry"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-peach/30 px-2 py-0.5 text-[10px] font-bold text-berry">
                          {item.badge}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-sm font-bold text-ink">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-xs text-ink/65 leading-relaxed">
                        {item.desc}
                      </p>
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

          {/* STEP 2: Year of Birth & Age Calibration */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Clinical Calibration
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  When were you born?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Reproductive hormones, cycle length, and follicular phase durations shift across biological ages.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1.5">
                      Year of Birth
                    </label>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(parseInt(e.target.value))}
                      className="w-full rounded-2xl border border-peach bg-cream/40 px-3.5 py-3 text-sm font-bold text-ink focus:border-berry focus:bg-white focus:outline-none"
                    >
                      {Array.from({ length: 60 }).map((_, i) => {
                        const y = currentYear - 10 - i;
                        return (
                          <option key={y} value={y}>
                            {y} ({currentYear - y} yrs)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1.5">
                      Birth Month
                    </label>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full rounded-2xl border border-peach bg-cream/40 px-3.5 py-3 text-sm font-bold text-ink focus:border-berry focus:bg-white focus:outline-none"
                    >
                      {[
                        { num: "01", name: "January" },
                        { num: "02", name: "February" },
                        { num: "03", name: "March" },
                        { num: "04", name: "April" },
                        { num: "05", name: "May" },
                        { num: "06", name: "June" },
                        { num: "07", name: "July" },
                        { num: "08", name: "August" },
                        { num: "09", name: "September" },
                        { num: "10", name: "October" },
                        { num: "11", name: "November" },
                        { num: "12", name: "December" },
                      ].map((m) => (
                        <option key={m.num} value={m.num}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-peach/40 bg-cream/30 p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-ink/60">Calculated Biological Age:</span>
                    <span className="font-bold text-ink ml-1.5">{calculatedAge} Years Old</span>
                  </div>
                  <span className="rounded-full bg-berry/10 px-2.5 py-1 text-[11px] font-bold text-berry">
                    {computedAgeGroup} Tier
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Cycle Regularity */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Cycle Predictability
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Are your menstrual cycles regular?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  A cycle is considered regular if the gap between period start dates is consistent within 1–3 days.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "regular",
                    label: "Yes, regular within 1–2 days",
                    desc: "My period arrives reliably around the same date every month.",
                  },
                  {
                    id: "irregular",
                    label: "No, somewhat irregular",
                    desc: "It fluctuates by a week or more from month to month.",
                  },
                  {
                    id: "varies",
                    label: "Unpredictable / Skips months",
                    desc: "Due to stress, travel, postpartum, PCOS, or birth control.",
                  },
                  {
                    id: "unknown",
                    label: "I honestly don't know yet",
                    desc: "I haven't tracked consistently before.",
                  },
                ].map((item) => {
                  const isSelected = regularity === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRegularity(item.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-berry bg-blush/30 shadow-2xs"
                          : "border-peach/50 bg-cream/20 hover:border-peach hover:bg-white"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-ink">{item.label}</p>
                        <p className="text-xs text-ink/65">{item.desc}</p>
                      </div>
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-berry bg-berry text-white"
                            : "border-peach bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Cycle Length & Period Duration Steppers */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Cycle Length Calibration
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Typical cycle & period duration
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Adjust these steppers to match your average cycle rhythm. 28 days is the global clinical baseline.
                </p>
              </div>

              <div className="space-y-4">
                <FloStepper
                  label="Average Cycle Length (Day 1 to Next Day 1)"
                  value={cycleLength}
                  min={20}
                  max={45}
                  unit="days"
                  onChange={setCycleLength}
                />

                <FloStepper
                  label="Average Period Bleeding Duration"
                  value={periodDuration}
                  min={2}
                  max={10}
                  unit="days"
                  onChange={setPeriodDuration}
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 5: Last Menstrual Period Date */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Baseline Anchor
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  When did your last period start?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Day 1 is the first day of full red bleeding. This anchors our prediction algorithm.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-peach/70 bg-white p-5 shadow-2xs space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                    Select Start Date
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full rounded-xl border border-peach bg-cream/40 px-4 py-3 text-base font-bold text-ink focus:border-berry focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Quick Selection Shortcuts */}
                <div>
                  <span className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">
                    Quick Shortcuts:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "This week (3d ago)", daysAgo: 3 },
                      { label: "Last week (7d ago)", daysAgo: 7 },
                      { label: "2 weeks ago", daysAgo: 14 },
                      { label: "3 weeks ago", daysAgo: 21 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          const d = new Date(Date.now() - item.daysAgo * 86400000)
                            .toISOString()
                            .split("T")[0];
                          setLastPeriodDate(d);
                        }}
                        className="rounded-xl border border-peach/50 bg-cream/30 py-2 px-3 text-ink/80 hover:bg-white hover:border-peach transition-all text-left"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 6: Flow & Cramp Severity */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Period Profile
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Flow intensity & cramp levels
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Helps detect heavy menstrual bleeding (menorrhagia) and dysmenorrhea early.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Typical Blood Flow:
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { id: "LIGHT", label: "Light", icon: "💧" },
                      { id: "MEDIUM", label: "Medium", icon: "💧💧" },
                      { id: "HEAVY", label: "Heavy", icon: "🩸" },
                      { id: "SPOTTING", label: "Spotting", icon: "✨" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFlowLevel(f.id)}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          flowLevel === f.id
                            ? "border-berry bg-blush/40 font-bold text-berry shadow-xs"
                            : "border-peach/50 bg-cream/20 text-ink/80 hover:bg-white"
                        }`}
                      >
                        <span className="text-base block mb-1">{f.icon}</span>
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Menstrual Cramps Severity:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "none", label: "No Cramps", desc: "Rarely feel pain" },
                      { id: "mild", label: "Mild Twinges", desc: "Easily manageable" },
                      { id: "moderate", label: "Moderate Cramps", desc: "Need rest or tea" },
                      { id: "severe", label: "Severe / Intense", desc: "Impacts daily activities" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCrampSeverity(c.id)}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          crampSeverity === c.id
                            ? "border-berry bg-blush/40 shadow-xs"
                            : "border-peach/50 bg-cream/20 hover:bg-white"
                        }`}
                      >
                        <p className="font-bold text-ink">{c.label}</p>
                        <p className="text-[11px] text-ink/65 mt-0.5">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(7)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 7: Physical PMS Symptoms (Multi-select) */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Physical Symptoms
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Do you experience physical PMS?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Select all symptoms that frequently occur 1–7 days before your period.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {[
                  { id: "cramps", label: "Abdominal Cramps", icon: "⚡" },
                  { id: "bloating", label: "Bloating / Puffiness", icon: "🎈" },
                  { id: "breast_pain", label: "Breast Tenderness", icon: "🌸" },
                  { id: "headache", label: "Headache / Migraine", icon: "🤕" },
                  { id: "fatigue", label: "Fatigue / Low Stamina", icon: "😴" },
                  { id: "acne", label: "Acne Breakouts", icon: "✨" },
                  { id: "backache", label: "Lower Back Pain", icon: "🩹" },
                  { id: "cravings", label: "Sugar & Food Cravings", icon: "🍫" },
                  { id: "none", label: "None of these", icon: "🌱" },
                ].map((item) => {
                  const isSelected = selectedSymptoms.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSymptom(item.id)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all text-xs font-medium ${
                        isSelected
                          ? "border-berry bg-blush/40 text-berry font-bold shadow-2xs"
                          : "border-peach/50 bg-cream/20 text-ink/80 hover:bg-white hover:border-peach"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(8)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 8: Emotional & Mood Shifts */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Mood & Emotional Health
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Any emotional changes before your period?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Hormonal drops in serotonin and progesterone can affect mood. Select all that resonate.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {[
                  { id: "calm", label: "Calm & Stable", icon: "🧘" },
                  { id: "irritable", label: "Irritable / Agitated", icon: "😤" },
                  { id: "anxious", label: "Anxious / On Edge", icon: "😰" },
                  { id: "low", label: "Low Mood / Tearful", icon: "🥺" },
                  { id: "brain_fog", label: "Brain Fog / Poor Focus", icon: "🌫️" },
                  { id: "mood_swings", label: "Unpredictable Swings", icon: "🎢" },
                  { id: "energetic", label: "Productivity Bursts", icon: "⚡" },
                ].map((item) => {
                  const isSelected = selectedMoods.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleMood(item.id)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all text-xs font-medium ${
                        isSelected
                          ? "border-berry bg-blush/40 text-berry font-bold shadow-2xs"
                          : "border-peach/50 bg-cream/20 text-ink/80 hover:bg-white hover:border-peach"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(9)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 9: Sleep & Daily Stress */}
          {step === 9 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Lifestyle & Recovery
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Sleep duration & stress levels
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Cortisol directly impacts ovulation timing and luteal phase stability.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Average Nightly Sleep:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "<6", label: "Under 6 hrs", icon: "🌙" },
                      { id: "6-8", label: "6 to 8 hrs", icon: "✨" },
                      { id: "8+", label: "8+ hrs", icon: "🛌" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSleepDuration(s.id)}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          sleepDuration === s.id
                            ? "border-berry bg-blush/40 font-bold text-berry shadow-xs"
                            : "border-peach/50 bg-cream/20 text-ink/80 hover:bg-white"
                        }`}
                      >
                        <span className="text-base block mb-1">{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Everyday Stress Level:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "low", label: "Low", icon: "🌿" },
                      { id: "moderate", label: "Moderate", icon: "⚖️" },
                      { id: "high", label: "High / Intense", icon: "🌪️" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStressLevel(st.id)}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          stressLevel === st.id
                            ? "border-berry bg-blush/40 font-bold text-berry shadow-xs"
                            : "border-peach/50 bg-cream/20 text-ink/80 hover:bg-white"
                        }`}
                      >
                        <span className="text-base block mb-1">{st.icon}</span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(10)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 10: Reproductive Health Conditions */}
          {step === 10 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="inline-block rounded-full bg-peach/40 px-3 py-1 text-xs font-bold text-berry">
                  Medical Context
                </span>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Any diagnosed health conditions?
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Helps our AI tailor cycle algorithms for delayed ovulation or hormonal variances.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "PCOS",
                    label: "PCOS or PCOD",
                    desc: "Polycystic Ovary Syndrome with irregular cycle lengths",
                  },
                  {
                    id: "ENDOMETRIOSIS",
                    label: "Endometriosis",
                    desc: "Severe pelvic pain and heavy menstrual flow",
                  },
                  {
                    id: "THYROID",
                    label: "Thyroid Condition",
                    desc: "Hypo- or hyper-thyroidism affecting metabolism",
                  },
                  {
                    id: "ANEMIA",
                    label: "Anemia / Iron Deficiency",
                    desc: "Fatigue or dizziness linked to blood loss",
                  },
                  {
                    id: "NONE",
                    label: "None of the above / Healthy baseline",
                    desc: "No diagnosed reproductive or metabolic conditions",
                  },
                ].map((item) => {
                  const isSelected = selectedConditions.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCondition(item.id)}
                      className={`w-full rounded-2xl border p-3.5 text-left transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? "border-berry bg-blush/30 shadow-2xs"
                          : "border-peach/50 bg-cream/20 hover:border-peach hover:bg-white"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-ink">{item.label}</p>
                        <p className="text-[11px] text-ink/65 mt-0.5">{item.desc}</p>
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-berry bg-berry text-white"
                            : "border-peach bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(11)}
                className="w-full rounded-2xl bg-berry py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Generate Cycle Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 11: Real-time Analysis Insights & Account Creation */}
          {step === 11 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Assessment Complete</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Your Personalized Cycle Blueprint
                </h1>
                <p className="text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
                  Create your free account to lock in your personalized cycle tracker and clinical insights.
                </p>
              </div>

              {/* Assessment Preview Box */}
              <div className="rounded-2xl border border-peach/70 bg-linear-to-br from-cream/60 via-[#FFF9FA] to-blush/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-ink border-b border-peach/30 pb-2">
                  <span>Calculated Cycle Metrics</span>
                  <span className="text-berry">Phase: Follicular / Day 14</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Cycle Rhythm</p>
                    <p className="font-bold text-ink mt-0.5">{cycleLength} Days</p>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Period Bleed</p>
                    <p className="font-bold text-ink mt-0.5">{periodDuration} Days</p>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-peach/30">
                    <p className="text-[10px] text-ink/50 uppercase">Next Period</p>
                    <p className="font-bold text-rose-600 mt-0.5">In 14 Days</p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-2xl bg-rose-50 p-3.5 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Account Credentials */}
              <div className="space-y-3">
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
                        Create Password (min. 8 characters)
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full rounded-2xl border border-peach bg-cream/30 px-3.5 py-2.5 text-sm font-semibold text-ink focus:border-berry focus:bg-white focus:outline-none shadow-2xs"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>
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
                  onClick={() => setStep(10)}
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
      <footer className="mx-auto w-full max-w-xl text-center pt-4 text-[11px] text-ink/45">
        Sakhi AI delivers predictive cycle insights based on clinical algorithms. Not a substitute for professional medical diagnosis.
      </footer>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDFB]">
          <div className="flex flex-col items-center gap-3 text-ink/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-berry/30 border-t-berry" />
            <span className="text-xs">Loading Sakhi AI Onboarding...</span>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
