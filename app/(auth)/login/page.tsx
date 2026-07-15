"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) return setErrors(validation);
    setErrors({});
    setLoading(true);

    try {
      // Demo login — replace with authApi.login() when backend is ready
      await new Promise((r) => setTimeout(r, 1200));
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
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-mint/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-soft">
            <span className="text-2xl">🌸</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in to continue your learning journey with Sakhi.</p>
        </div>

        <Card className="animate-fade-in">
          {errors.general && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="priya@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
              leftIcon={<EmailIcon />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
              leftIcon={<LockIcon />}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-berry hover:underline"
              >
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

        {/* Trust line */}
        <p className="mt-6 text-center text-xs text-ink/40">
          🔒 Your data is private and never shared.
        </p>
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
