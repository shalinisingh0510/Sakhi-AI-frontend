"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { wellnessApi, type WellnessDashboardResponse } from "@/lib/api";
import { HealthOnboarding } from "@/components/health/onboarding";
import { HealthDashboard } from "@/components/health/HealthDashboard";
import { HealthHeader } from "@/components/health/HealthHeader";
import { Lock, Sparkles, ShieldCheck, CalendarHeart } from "lucide-react";

type LoadState = "loading" | "no-auth" | "no-profile" | "has-profile" | "error";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function HealthPage({ params }: Props) {
  const t = useTranslations("HealthProfile");
  const token = useAuthStore((s) => s.token);
  const [dashboardData, setDashboardData] = useState<WellnessDashboardResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  const fetchDashboard = useCallback(async () => {
    try {
      const currentToken = useAuthStore.getState().token;
      if (!currentToken) {
        setLoadState("error");
        return;
      }
      const data = await wellnessApi.getDashboard(currentToken);
      setDashboardData(data);

      if (data.profile.is_complete) {
        setLoadState("has-profile");
      } else {
        setLoadState("no-profile");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Dashboard failed to load", error);
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    // If not authenticated, open login popup and switch to no-auth state
    if (!token) {
      const timer = setTimeout(() => {
        if (!useAuthStore.getState().token) {
          setLoadState("no-auth");
          useAuthModalStore.getState().openAuthModal("health");
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    fetchDashboard();
  }, [token, fetchDashboard]);

  const handleOnboardingComplete = async () => {
    setLoadState("loading");
    try {
      const currentToken = useAuthStore.getState().token || token;
      if (currentToken) {
        const data = await wellnessApi.getDashboard(currentToken);
        setDashboardData(data);
        if (data.profile.is_complete) {
          setLoadState("has-profile");
          return;
        }
      }
    } catch (err) {
      console.error("Dashboard failed to load after onboarding", err);
    }
    // Hard refresh fallback if data isn't immediately populated
    window.location.href = `/${locale}/health`;
  };

  return (
    <div className="min-h-screen bg-blush/10">
      <div className="mx-auto max-w-2xl px-4 pb-12">
        <HealthHeader />

        {loadState === "loading" && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-ink/40">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-berry/30 border-t-berry" />
              <span className="text-sm">{t("loading")}</span>
            </div>
          </div>
        )}

        {loadState === "no-auth" && (
          <div className="my-8 overflow-hidden rounded-3xl border border-peach/70 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blush/80 text-berry shadow-inner">
                <Lock className="h-8 w-8 text-berry" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-peach/40 px-3 py-1 text-xs font-semibold text-berry">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Private & Anonymous</span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                Sign in to Access Your Health Sanctuary
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                To safeguard your cycle logs, track menstrual symptoms, and deliver personalized medical guidance, please log in or create an account.
              </p>

              <div className="mt-6 w-full max-w-sm rounded-2xl border border-peach/50 bg-[#FCF8FA] p-4 text-left space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CalendarHeart className="h-4 w-4 shrink-0 text-berry mt-0.5" />
                  <span>Cycle phase calculation & next period predictions</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <Sparkles className="h-4 w-4 shrink-0 text-berry mt-0.5" />
                  <span>Personalized relief remedies verified by gynaecologists</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-berry mt-0.5" />
                  <span>End-to-end encrypted; without login your records cannot be saved</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => useAuthModalStore.getState().openAuthModal("health")}
                  className="w-full rounded-2xl bg-berry py-3 px-5 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all active:scale-[0.99]"
                >
                  Sign In / Create Account
                </button>
              </div>
            </div>
          </div>
        )}

        {loadState === "no-profile" && token && (
          <HealthOnboarding token={token} locale={locale} onComplete={handleOnboardingComplete} />
        )}

        {loadState === "has-profile" && dashboardData && (
          <HealthDashboard data={dashboardData} />
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <p className="text-sm text-ink/60">
              {t("errors.loadFailed", { fallback: "Unable to load your wellness data right now." })}
            </p>
            <button
              onClick={() => {
                setLoadState("loading");
                const t2 = useAuthStore.getState().token;
                if (t2) {
                  wellnessApi
                    .getDashboard(t2)
                    .then((data) => {
                      setDashboardData(data);
                      setLoadState(data.profile.is_complete ? "has-profile" : "no-profile");
                    })
                    .catch(() => setLoadState("error"));
                } else {
                  setLoadState("no-auth");
                  useAuthModalStore.getState().openAuthModal("health");
                }
              }}
              className="rounded-full bg-berry px-6 py-2 text-sm text-white hover:bg-berry/80 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
