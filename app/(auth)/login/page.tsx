"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
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
      // Demo login - replace with authApi.login() when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1200));
      login(
        {
          id: "demo-1",
          name: "Priya",
          email: form.email,
          ageGroup: "18+",
          language: "en",
          onboardingComplete: false,
        },
        "demo-token-123"
      );
      router.push("/onboarding");
    } catch {
      setErrors({ general: "Invalid email or password. Please try again." });
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-8 h-80 w-80 rounded-full bg-blush/70 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-mint/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:gap-12">
        <section className="space-y-6 text-center lg:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-berry shadow-soft lg:mx-0">
            <span className="h-2 w-2 rounded-full bg-rose" />
            Safe learning space
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-berry/80 sm:text-base">
                  Gentle guidance for girls and women
                </p>
                <h1 className="mt-3 font-display text-5xl font-black leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  Welcome to <span className="bg-gradient-to-r from-rose via-berry to-moss bg-clip-text text-transparent">Sakhi AI</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base lg:mx-0 lg:text-lg">
                  Sign in to continue your learning journey with Sakhi and get calm, trusted support whenever you need it.
                </p>
              </div>

              <div className="flex w-full justify-center lg:w-auto lg:flex-shrink-0">
                <CuteGirlIllustration />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Kind, private support",
              "Easy learning access",
              "Designed for girls",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm font-medium text-ink/65 shadow-soft backdrop-blur-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <Card className="animate-fade-in border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(123,62,115,0.12)] backdrop-blur-sm">
            {errors.general && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                placeholder="priya@example.com"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
                leftIcon={<EmailIcon />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
                leftIcon={<LockIcon />}
              />

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-berry hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-2">
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
              New to Sakhi AI?{" "}
              <Link href="/register" className="font-semibold text-berry hover:underline">
                Create an account
              </Link>
            </p>
          </Card>

          <p className="mt-6 text-center text-xs text-ink/40">
            {"🔒"} Your data is private and never shared.
          </p>
        </div>
      </div>
    </main>
  );
}

function CuteGirlIllustration() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="h-auto w-full max-w-[320px] drop-shadow-[0_20px_40px_rgba(123,62,115,0.18)]"
      role="img"
      aria-label="Cute girl illustration"
    >
      <defs>
        <linearGradient id="skin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffe6d8" />
          <stop offset="100%" stopColor="#f7c9bf" />
        </linearGradient>
        <linearGradient id="hair" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6d395f" />
          <stop offset="100%" stopColor="#3f233a" />
        </linearGradient>
        <linearGradient id="dress" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e87f9f" />
          <stop offset="100%" stopColor="#8f4d90" />
        </linearGradient>
        <linearGradient id="halo" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff6fb" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f8e6ff" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <circle cx="180" cy="180" r="154" fill="url(#halo)" />
      <circle cx="180" cy="180" r="128" fill="#fff" opacity="0.8" />
      <path d="M92 256c12-33 32-53 58-62 14-5 34-8 30-26-5-21-9-42 4-54 15-14 43-14 58 0 13 12 9 33 4 54-4 18 16 21 30 26 26 9 46 29 58 62" fill="url(#dress)" opacity="0.98" />
      <path d="M129 145c1-34 23-61 51-61h0c28 0 50 27 51 61l2 50c0 16-15 30-33 30h-40c-18 0-33-14-33-30l2-50z" fill="url(#skin)" />
      <path d="M128 136c4-37 28-63 53-63 26 0 46 16 54 43 6 18 6 39 3 57-2 11-12 17-23 17H150c-14 0-25-10-25-24l3-30z" fill="url(#hair)" />
      <path d="M125 142c8-18 19-31 33-39 7-4 14-6 23-6 18 0 34 7 48 22 5 5 9 12 12 20" fill="none" stroke="#3f233a" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="154" cy="170" r="5" fill="#3f233a" />
      <circle cx="206" cy="170" r="5" fill="#3f233a" />
      <path d="M161 190c6 7 28 7 34 0" fill="none" stroke="#cf6a86" strokeWidth="5" strokeLinecap="round" />
      <path d="M153 198c10 10 44 10 54 0" fill="none" stroke="#7b3e73" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      <path d="M114 120c10-18 27-31 47-36" fill="none" stroke="#8d5478" strokeWidth="16" strokeLinecap="round" />
      <path d="M244 121c-11-19-29-32-48-37" fill="none" stroke="#8d5478" strokeWidth="16" strokeLinecap="round" />
      <path d="M170 220h20" stroke="#f7b6c5" strokeWidth="8" strokeLinecap="round" />
      <path d="M180 220v63" stroke="#f1a9ba" strokeWidth="14" strokeLinecap="round" />
      <path d="M132 244c15-10 31-15 48-15s33 5 48 15" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
      <path d="M140 233l-22 58" stroke="#f2a2b8" strokeWidth="16" strokeLinecap="round" />
      <path d="M220 233l22 58" stroke="#f2a2b8" strokeWidth="16" strokeLinecap="round" />
      <path d="M103 258c15 15 32 22 51 22" fill="none" stroke="#e87f9f" strokeWidth="18" strokeLinecap="round" />
      <path d="M257 258c-15 15-32 22-51 22" fill="none" stroke="#8f4d90" strokeWidth="18" strokeLinecap="round" />
      <circle cx="93" cy="112" r="14" fill="#fff6fb" opacity="0.8" />
      <circle cx="281" cy="113" r="10" fill="#fff6fb" opacity="0.8" />
      <circle cx="273" cy="252" r="8" fill="#ffd6e2" />
      <circle cx="93" cy="252" r="8" fill="#ffd6e2" />
      <path d="M269 78l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10z" fill="#f8a5c2" />
      <path d="M76 196l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z" fill="#f8a5c2" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
