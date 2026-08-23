"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DailyCheckIn, type InitialCheckInData } from "@/components/health/check-in/DailyCheckIn";
import { wellnessApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function CheckInPage() {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const [initialData, setInitialData] = useState<InitialCheckInData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToday() {
      try {
        const token = useAuthStore.getState().token;
        if (!token) return;
        const data = await wellnessApi.getTodayCheckIn(token);
        setInitialData(data);
      } catch (err) {
        console.error("Failed to load today's check-in", err);
      } finally {
        setLoading(false);
      }
    }
    loadToday();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-berry"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-ink/60 hover:text-berry mb-4 flex items-center gap-1"
        >
          ← {tCommon("back")}
        </button>
      </header>

      <main>
        <DailyCheckIn 
          initialData={initialData}
          onSuccess={() => router.push("/health")}
          onCancel={() => router.back()}
        />
      </main>
    </div>
  );
}
