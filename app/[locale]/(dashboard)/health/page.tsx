"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { wellnessApi, type WellnessDashboardResponse } from "@/lib/api";
import { HealthOnboarding } from "@/components/health/onboarding";
import { HealthDashboard } from "@/components/health/HealthDashboard";
import { HealthHeader } from "@/components/health/HealthHeader";

type LoadState = "loading" | "no-profile" | "has-profile" | "error";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function HealthPage({ params }: Props) {
  const t = useTranslations("HealthProfile");
  // useAuthStore is a Zustand persisted store — it hydrates from localStorage
  // AFTER the first render, so token may be null on first pass.
  // We use the store's built-in _hasHydrated sentinel (via onRehydrateStorage)
  // by reading the store and tracking hydration ourselves.
  const token = useAuthStore((s) => s.token);
  const [dashboardData, setDashboardData] = useState<WellnessDashboardResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [locale, setLocale] = useState("en");
  // Track whether we have already fetched once so token re-renders don't re-fetch
  const hasFetched = useRef(false);

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    // Wait until token is available (Zustand persist hydrates asynchronously)
    if (!token) {
      // Give Zustand 1 tick to hydrate, then if still no token show error
      const timer = setTimeout(() => {
        if (!useAuthStore.getState().token) {
          setLoadState("error");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchDashboard() {
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
    }

    fetchDashboard();
  }, [token]);

  return (
    <div className="min-h-screen bg-blush/10">
      <div className="mx-auto max-w-2xl px-4">
        <HealthHeader />

        {loadState === "loading" && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-ink/40">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-berry/30 border-t-berry" />
              <span className="text-sm">{t("loading")}</span>
            </div>
          </div>
        )}

        {loadState === "no-profile" && token && (
          <HealthOnboarding token={token} locale={locale} />
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
                hasFetched.current = false;
                setLoadState("loading");
                const t2 = useAuthStore.getState().token;
                if (t2) {
                  hasFetched.current = true;
                  wellnessApi
                    .getDashboard(t2)
                    .then((data) => {
                      setDashboardData(data);
                      setLoadState(data.profile.is_complete ? "has-profile" : "no-profile");
                    })
                    .catch(() => setLoadState("error"));
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
