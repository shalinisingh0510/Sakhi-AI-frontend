"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { wellnessApi, type WellnessDashboardResponse } from "@/lib/api";
import { isDemoMode } from "@/lib/api-config";
import { HealthOnboarding } from "@/components/health/onboarding";
import { HealthDashboard } from "@/components/health/HealthDashboard";
import { HealthHeader } from "@/components/health/HealthHeader";

type LoadState = "loading" | "no-profile" | "has-profile" | "error";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function HealthPage({ params }: Props) {
  const t = useTranslations("HealthProfile");
  const { token } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<WellnessDashboardResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    if (!token) return;

    async function fetchDashboard() {
      try {
        if (isDemoMode()) {
          setLoadState("no-profile");
          return;
        }
        const data = await wellnessApi.getDashboard(token!);
        setDashboardData(data);
        
        if (data.profile.is_complete) {
            setLoadState("has-profile");
        } else {
            setLoadState("no-profile");
        }
      } catch (err: any) {
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
            <p className="text-sm text-ink/60">{t("errors.loadFailed", { fallback: "Unable to load your wellness data right now." })}</p>
          </div>
        )}
      </div>
    </div>
  );
}
