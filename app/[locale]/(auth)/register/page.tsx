"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Heart,
  BookOpen,
  CalendarHeart,
  Globe,
  ChevronDown
} from "lucide-react";

import { authApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { SUPPORTED_LANGUAGES } from "@/components/layout/LanguageSelector";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const { login, setLoading, isLoading, isAuthenticated } = useAuthStore();
  const t = useTranslations("Auth.register");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: (locale || "en") as SupportedLanguage,
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t("errors.nameRequired");
    if (!form.email.trim()) e.email = t("errors.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("errors.emailInvalid");
    if (!form.password) e.password = t("errors.passwordRequired");
    else if (form.password.length < 8) e.password = t("errors.passwordShort");
    if (form.confirmPassword !== form.password)
      e.confirmPassword = t("errors.passwordsDontMatch");
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      document.cookie = `NEXT_LOCALE=${form.language}; path=/; max-age=31536000; SameSite=Lax`;

      if (isDemoMode()) {
        await demoDelay(1000);
        login(
          {
            id: "demo-1",
            name: form.name.trim(),
            email: form.email.trim(),
            ageGroup: "18+",
            language: form.language,
            role: "user",
            onboardingComplete: false,
          },
          "demo-token-123"
        );
        const redirectPath = form.language === "en" ? "/onboarding" : `/${form.language}/onboarding`;
        window.location.href = redirectPath;
        return;
      }

      const res = await authApi.register(form.name.trim(), form.email.trim(), form.password, form.language);
      const normalized = normalizeUser(res.user, form.email.trim());
      normalized.language = form.language;
      login(normalized, res.access_token);
      const redirectPath = form.language === "en" ? "/onboarding" : `/${form.language}/onboarding`;
      window.location.href = redirectPath;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : t("errors.general");
      setErrors({ general: errorMsg });
      setLoading(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFDF9] px-4 py-6 sm:px-6 lg:px-8">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-mint/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between pb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose/20 via-blush to-berry/10 text-xl shadow-xs group-hover:scale-105 transition-transform" aria-hidden="true">
              🌸
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-berry">
                Sakhi AI
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-500">
                Your Health. Your Voice. Your Sakhi.
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-berry transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="mt-4 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Value Proposition & Illustration */}
          <section className="hidden lg:col-span-7 lg:block space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-peach/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-berry shadow-2xs backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-rose" />
              <span>JOIN 120,000+ GIRLS &amp; WOMEN ACROSS INDIA</span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-peach/80 bg-white/70 p-8 shadow-soft backdrop-blur-sm">
              <h1 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-ink leading-[1.08]">
                Your personal safe sanctuary for{" "}
                <span className="text-berry">health &amp; clarity.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                Create a free, private account to access symptom forecasting, cycle tracking, bookmarks, and confidential medical answers.
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-peach/60 bg-white/80 p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/15 text-rose mb-2.5">
                    <CalendarHeart className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Smart Cycle Calendar</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Log periods, predict ovulation &amp; receive PMS care tips.
                  </p>
                </div>

                <div className="rounded-2xl border border-peach/60 bg-white/80 p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-2.5">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Save Guides &amp; Quizzes</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Bookmark bite-sized guides and track your learning badges.
                  </p>
                </div>

                <div className="rounded-2xl border border-peach/60 bg-white/80 p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-2.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">End-to-End Privacy</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Zero ads, zero data selling, and 100% anonymized logs.
                  </p>
                </div>

                <div className="rounded-2xl border border-peach/60 bg-white/80 p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-2.5">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Always Free for Girls</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Non-profit backed education accessible in 8+ dialects.
                  </p>
                </div>
              </div>

              {/* Verified Doctors Banner */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-3.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  All content is vetted by certified pediatricians and gynecologists following WHO and Indian health standards.
                </span>
              </div>
            </div>
          </section>

          {/* Right Column: Register Form Card */}
          <div className="w-full lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-peach/80 bg-white/95 p-6 sm:p-8 shadow-soft backdrop-blur-md">
              {/* Tab Switcher */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/60 mb-6">
                <Link
                  href="/login"
                  className="w-1/2 py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <div className="w-1/2 rounded-xl bg-white py-2 text-center text-xs font-bold text-berry shadow-2xs">
                  Create Account
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Join Sakhi AI today
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Begin your private, compassionate healthcare journey in seconds.
                </p>
              </div>

              {/* 1. Google One-Click Registration */}
              <GoogleAuthButton
                mode="signup"
                onError={(msg) => setErrors({ general: msg })}
              />

              {/* 2. Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200/80" />
                </div>
                <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
                  or register with email
                </span>
              </div>

              {/* Error Alert */}
              {errors.general && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose/30 bg-rose/10 p-3.5 text-xs text-rose" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* 3. Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t("nameLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("namePlaceholder")}
                      autoComplete="name"
                      {...field("name")}
                      className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
                        errors.name 
                          ? "border-rose bg-rose/5 focus:border-rose focus:ring-1 focus:ring-rose/20" 
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                      }`}
                    />
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-[11px] font-semibold text-rose">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t("emailLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email"
                      {...field("email")}
                      className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
                        errors.email 
                          ? "border-rose bg-rose/5 focus:border-rose focus:ring-1 focus:ring-rose/20" 
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                      }`}
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-[11px] font-semibold text-rose">{errors.email}</p>
                  )}
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Language (पसंदीदा भाषा)
                  </label>
                  <div className="relative">
                    <select
                      value={form.language}
                      onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as SupportedLanguage }))}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-semibold text-ink outline-none transition-all hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20 cursor-pointer"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.native} ({l.name})
                        </option>
                      ))}
                    </select>
                    <Globe className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-berry" />
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Your dashboard, chatbot, and health reminders will appear in this language.
                  </p>
                </div>

                {/* Password with Show/Hide */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t("passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      autoComplete="new-password"
                      {...field("password")}
                      className={`w-full rounded-2xl border py-2.5 pl-10 pr-11 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
                        errors.password 
                          ? "border-rose bg-rose/5 focus:border-rose focus:ring-1 focus:ring-rose/20" 
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                      }`}
                    />
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-[11px] font-semibold text-rose">{errors.password}</p>
                  ) : (
                    <p className="mt-1 text-[10px] text-slate-400">{t("passwordHint")}</p>
                  )}
                </div>

                {/* Confirm Password with Show/Hide */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t("confirmPasswordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("confirmPasswordPlaceholder")}
                      autoComplete="new-password"
                      {...field("confirmPassword")}
                      className={`w-full rounded-2xl border py-2.5 pl-10 pr-11 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
                        errors.confirmPassword 
                          ? "border-rose bg-rose/5 focus:border-rose focus:ring-1 focus:ring-rose/20" 
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                      }`}
                    />
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-semibold text-rose">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Agreement notice */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm((c) => ({ ...c, agreeTerms: e.target.checked }))}
                    className="h-4 w-4 rounded-md border-slate-300 text-berry focus:ring-berry/20 cursor-pointer accent-berry"
                  />
                  <label htmlFor="agreeTerms" className="text-[11px] text-slate-600 cursor-pointer select-none">
                    I agree to keep my health questions respectful and understand Sakhi is an educational companion.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-berry py-3.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-soft transition-all hover:bg-berry/90 active:scale-[0.99] disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <p className="mt-6 text-center text-xs text-slate-500">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/login" className="font-bold text-berry hover:underline">
                  {t("signIn")}
                </Link>
              </p>

              <p className="mt-4 text-center text-[11px] text-slate-400">
                {t("privacyNotice")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
