"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { authApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const t = useTranslations("Auth.register");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    if (!form.email) e.email = t("errors.emailRequired");
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
    if (Object.keys(validation).length) return setErrors(validation);
    setErrors({});
    setLoading(true);

    try {
      if (isDemoMode()) {
        await demoDelay(1200);
        login(
          {
            id: "demo-1",
            name: form.name,
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

      const { user, token } = await authApi.register(form.name, form.email, form.password);
      const normalized = normalizeUser(user, form.email);
      login({ ...normalized, name: form.name }, token);
      router.push("/onboarding");
    } catch {
      setErrors({ general: t("errors.general") });
      setLoading(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-mint/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-soft">
            <span className="text-2xl">🌸</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">{t("title")}</h1>
          <p className="mt-2 text-sm text-ink/60">
            {t("description")}
          </p>
        </div>

        <Card>
          {errors.general && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label={t("nameLabel")}
              type="text"
              placeholder={t("namePlaceholder")}
              error={errors.name}
              autoComplete="name"
              leftIcon={<PersonIcon />}
              {...field("name")}
            />

            <Input
              label={t("emailLabel")}
              type="email"
              placeholder={t("emailPlaceholder")}
              error={errors.email}
              autoComplete="email"
              leftIcon={<EmailIcon />}
              {...field("email")}
            />

            <Input
              label={t("passwordLabel")}
              type="password"
              placeholder={t("passwordPlaceholder")}
              error={errors.password}
              autoComplete="new-password"
              hint={t("passwordHint")}
              leftIcon={<LockIcon />}
              {...field("password")}
            />

            <Input
              label={t("confirmPasswordLabel")}
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              error={errors.confirmPassword}
              autoComplete="new-password"
              leftIcon={<LockIcon />}
              {...field("confirmPassword")}
            />

            <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-2">
              {t("createAccount")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="font-semibold text-berry hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-xs text-ink/40">
          {t("privacyNotice")}
        </p>
      </div>
    </main>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
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
