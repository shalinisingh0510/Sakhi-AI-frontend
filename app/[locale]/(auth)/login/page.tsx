"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const t = useTranslations("Auth.login");

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};

    if (!form.email) {
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
        await demoDelay(1200);
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
        return;
      }

      const { user, token } = await authApi.login(form.email, form.password);
      const normalized = normalizeUser(user, form.email);
      login(normalized, token);
      router.push(normalized.onboardingComplete ? "/dashboard" : "/onboarding");
    } catch {
      setErrors({ general: t("errors.general") });
      setLoading(false);
    }
  }

  const benefits = t.raw("benefits");

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
            {t("safeSpace")}
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-berry/80 sm:text-base">
                  {t("gentleGuidance")}
                </p>
                <h1 className="mt-3 font-display text-5xl font-black leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  {t("welcome")} <span className="bg-gradient-to-r from-rose via-berry to-moss bg-clip-text text-transparent">{t("sakhiAi")}</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base lg:mx-0 lg:text-lg">
                  {t("description")}
                </p>
              </div>

              <div className="flex w-full justify-center lg:w-auto lg:flex-shrink-0">
                <div className="relative aspect-square w-full max-w-[330px] rounded-[2.25rem] border border-white/90 bg-white/75 p-4 shadow-[0_24px_60px_rgba(123,62,115,0.16)] backdrop-blur-sm">
                  <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-br from-blush/40 via-white to-lavender/30" />
                  <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-white/55">
                    <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-rose/15 blur-2xl" />
                    <div className="absolute inset-x-10 bottom-8 h-12 rounded-full bg-mint/20 blur-2xl" />
                    <Image
                      src="/login-girl-illustration.png"
                      alt="Cute girl illustration"
                      width={820}
                      height={820}
                      priority
                      className="relative z-10 h-auto w-full scale-[1.03] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {benefits.map((item: string) => (
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
                label={t("emailLabel")}
                type="email"
                placeholder={t("emailPlaceholder")}
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
                leftIcon={<EmailIcon />}
              />

              <Input
                label={t("passwordLabel")}
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={form.password}
                onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
                leftIcon={<LockIcon />}
              />

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-berry hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-2">
                {t("signIn")}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
              {t("newToSakhi")}{" "}
              <Link href="/register" className="font-semibold text-berry hover:underline">
                {t("createAccount")}
              </Link>
            </p>
          </Card>

          <p className="mt-6 text-center text-xs text-ink/40">
            {t("privacyNotice")}
          </p>
        </div>
      </div>
    </main>
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
