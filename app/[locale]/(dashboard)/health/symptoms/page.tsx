"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { wellnessApi, SymptomLogResponse } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export default function SymptomsHistoryPage() {
  const router = useRouter();
  const t = useTranslations("Wellness.history");
  const ts = useTranslations("Wellness.symptoms");
  const tsev = useTranslations("Wellness.severity");
  
  const [symptoms, setSymptoms] = useState<SymptomLogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("unauthorized");
        // Limit to 50 for the list view
        const data = await wellnessApi.listSymptoms(token, 50, 0);
        setSymptoms(data);
      } catch (err: any) {
        setError(err.message || "Failed to load symptom history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      await wellnessApi.deleteSymptom(token, id);
      setSymptoms(symptoms.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete symptom", err);
    }
  };

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
          ← {useTranslations("Common")("back")}
        </button>
        <h1 className="text-3xl font-bold text-ink">{t("title")}</h1>
        <p className="text-ink/70 mt-2">{t("subtitle")}</p>
      </header>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      ) : symptoms.length === 0 ? (
        <div className="bg-sand/30 p-8 rounded-2xl border border-peach/30 text-center">
          <p className="text-ink/70">{t("noData")}</p>
          <button
            onClick={() => router.push("/health/check-in")}
            className="mt-4 px-6 py-2 bg-berry text-white rounded-lg font-medium hover:bg-berry/90 transition-colors"
          >
            {useTranslations("Wellness.checkin")("title")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {symptoms.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-xl border border-peach/30 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-ink">
                    {ts(`options.${log.symptom_code}`)}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    log.severity === "SEVERE" ? "bg-red-100 text-red-700" :
                    log.severity === "MODERATE" ? "bg-orange-100 text-orange-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {tsev(`options.${log.severity}`)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink/60">
                  <span>{new Date(log.start_date).toLocaleDateString()}</span>
                  {log.cycle_day && (
                    <span className="bg-peach text-berry px-2 py-0.5 rounded text-xs font-medium">
                      Cycle Day {log.cycle_day}
                    </span>
                  )}
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm text-ink/80 bg-sand/30 p-2 rounded-lg italic">
                    "{log.notes}"
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="text-ink/40 hover:text-red-500 transition-colors p-2"
                aria-label="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
