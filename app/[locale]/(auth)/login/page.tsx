"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Heart
} from "lucide-react";

import { authApi, healthApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { useAuthStore } from "@/lib/auth-store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect");
  
  const { login, setLoading, isLoading, isAuthenticated, user } = useAuthStore();
  const t = useTranslations("Auth.login");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(user?.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    }
  }, [isAuthenticated, router, user, redirectPath]);

  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};

    if (!form.email.trim()) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t("errors.emailInvalid");
    }

    if (!form.password) {
      newErrors.password = t("errors.passwordRequired");
    } else if (form.password.length < 6) {
      newErrors.password = t("errors.passwordShort");
    }

    return newErrors;
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
      if (isDemoMode()) {
        await demoDelay(1000);
        login(
          {
            id: "demo-1",
            name: "Priya",
            email: form.email,
            ageGroup: "18+",
            language: "en",
            role: "user",
            onboardingComplete: true,
          },
          "demo-token-123"
        );
        router.push(redirectPath || "/dashboard");
        return;
      }

      const res = await authApi.login(form.email, form.password);
      const normalized = normalizeUser(res.user, form.email);
      
      // Check onboarding state via health profile check
      try {
        await healthApi.getProfile(res.access_token);
        normalized.onboardingComplete = true;
      } catch {
        normalized.onboardingComplete = false;
      }
      
      login(normalized, res.access_token);
      
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(normalized.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : t("errors.general");
      setErrors({ general: errorMsg });
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFDF9] px-4 py-6 sm:px-6 lg:px-8">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-8 h-80 w-80 rounded-full bg-blush/70 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-mint/40 blur-3xl" />
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
          {/* Left Column: Visual Showcase */}
          <section className="hidden lg:col-span-7 lg:block space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-peach/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-berry shadow-2xs backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-rose animate-pulse" />
              <span>100% PRIVATE &amp; SAFE LEARNING SPACE</span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-peach/80 bg-white/70 p-8 shadow-soft backdrop-blur-sm">
              <h1 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-ink leading-[1.08]">
                Understand your body with{" "}
                <span className="text-berry">dignity &amp; warmth.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                Accurate, stigma-free guidance for puberty, cycles, emotional wellness, and feminine health. Log in to track your cycles and continue your learning modules.
              </p>

              {/* Illustration Card */}
              <div className="mt-8 relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blush/40 via-white to-lavender/30 border border-peach/60 shadow-inner flex items-center justify-center p-4">
                <Image
                  src="/login-girl-illustration.png"
                  alt="Sakhi AI companion illustration"
                  width={600}
                  height={400}
                  priority
                  className="max-h-full w-auto object-contain drop-shadow-md"
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-peach/60 pt-6">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">100% Anonymous</p>
                    <p className="text-[11px] text-slate-500">Zero data sharing</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-rose mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Doctor-Vetted</p>
                    <p className="text-[11px] text-slate-500">Gynecologist approved</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Heart className="h-4 w-4 shrink-0 text-berry mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">8+ Languages</p>
                    <p className="text-[11px] text-slate-500">Multilingual voice</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Auth Card */}
          <div className="w-full lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-peach/80 bg-white/95 p-6 sm:p-8 shadow-soft backdrop-blur-md">
              {/* Tab Switcher */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/60 mb-6">
                <div className="w-1/2 rounded-xl bg-white py-2 text-center text-xs font-bold text-berry shadow-2xs">
                  Sign In
                </div>
                <Link
                  href="/register"
                  className="w-1/2 py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Create Account
                </Link>
              </div>

              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Welcome back to Sakhi
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Please enter your credentials to access your health dashboard.
                </p>
              </div>

              {/* 1. Google One-Click Login */}
              <GoogleAuthButton
                mode="signin"
                onError={(msg) => setErrors({ general: msg })}
              />

              {/* 2. Elegant Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200/80" />
                </div>
                <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
                  or continue with email
                </span>
              </div>

              {/* Error banner */}
              {errors.general && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose/30 bg-rose/10 p-3.5 text-xs text-rose" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* 3. Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                      autoComplete="email"
                      className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
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

                {/* Password Input with Show/Hide toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      {t("passwordLabel")}
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-berry hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      value={form.password}
                      onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                      autoComplete="current-password"
                      className={`w-full rounded-2xl border py-3 pl-10 pr-11 text-xs font-medium text-ink outline-none transition-all placeholder:text-slate-400 ${
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
                  {errors.password && (
                    <p className="mt-1 text-[11px] font-semibold text-rose">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={form.rememberMe}
                    onChange={(e) => setForm((c) => ({ ...c, rememberMe: e.target.checked }))}
                    className="h-4 w-4 rounded-md border-slate-300 text-berry focus:ring-berry/20 cursor-pointer accent-berry"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none">
                    Remember me on this device
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-berry py-3.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-soft transition-all hover:bg-berry/90 active:scale-[0.99] disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <p className="mt-6 text-center text-xs text-slate-500">
                {t("newToSakhi")}{" "}
                <Link href="/register" className="font-bold text-berry hover:underline">
                  {t("createAccount")}
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-berry/30 border-t-berry" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
