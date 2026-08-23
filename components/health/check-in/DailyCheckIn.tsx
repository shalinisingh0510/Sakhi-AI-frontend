"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoodSelector } from "./MoodSelector";
import { EnergySelector } from "./EnergySelector";
import { SymptomSelector } from "./SymptomSelector";
import { wellnessApi } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function DailyCheckIn({ onSuccess, onCancel, initialData }: Props) {
  const t = useTranslations("Wellness.checkin");
  const errT = useTranslations("Common.errors");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [mood, setMood] = useState<string | undefined>(initialData?.mood?.mood_code);
  const [energy, setEnergy] = useState<string | undefined>(initialData?.energy?.energy_level);
  const [symptoms, setSymptoms] = useState<any[]>(
    initialData?.symptoms?.map((s: any) => ({
      symptom_code: s.symptom_code,
      category: s.category,
      severity: s.severity,
    })) || []
  );
  
  // Date is fixed to today for the daily check-in UI
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("unauthorized");

      const payload = {
        log_date: today,
        mood: mood ? { mood_code: mood, intensity: "MEDIUM" } : undefined,
        energy: energy ? { energy_level: energy } : undefined,
        symptoms: symptoms.map(s => ({
          ...s,
          start_date: today,
        })),
      };

      await wellnessApi.submitCheckIn(token, payload);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Check-in error:", err);
      setError(err.message || errT("generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sand/30 rounded-2xl p-4 sm:p-6 shadow-sm border border-peach/30 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-ink mb-1">{t("title")}</h2>
      <p className="text-sm text-ink/70 mb-6">{t("subtitle")}</p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <MoodSelector 
          value={mood} 
          onChange={setMood} 
          disabled={loading} 
        />
        
        <EnergySelector 
          value={energy} 
          onChange={setEnergy} 
          disabled={loading} 
        />
        
        <SymptomSelector 
          selectedSymptoms={symptoms} 
          onChange={setSymptoms} 
          disabled={loading} 
        />
      </div>

      <div className="mt-8 pt-6 border-t border-peach/30 flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-ink/70 hover:bg-peach/10 rounded-lg transition-colors"
          >
            {t("cancel")}
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || (!mood && !energy && symptoms.length === 0)}
          className="flex-1 bg-berry text-white py-3 rounded-lg font-medium hover:bg-berry/90 transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
