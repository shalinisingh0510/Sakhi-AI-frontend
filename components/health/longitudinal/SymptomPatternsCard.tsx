"use client";

import { useEffect, useState } from "react";
import { longitudinalApi, LongitudinalPatternsResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Activity, AlertCircle } from "lucide-react";

export function SymptomPatternsCard() {
  const { token } = useAuthStore();
  const [data, setData] = useState<LongitudinalPatternsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    longitudinalApi.getPatterns(token, "90d")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Failed to load patterns", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white/40 p-6 rounded-3xl animate-pulse flex items-center justify-center h-40">
        <span className="text-ink/50 text-sm">Loading patterns...</span>
      </div>
    );
  }

  if (!data || data.symptom_patterns.length === 0) {
    return null; // Don't show if no patterns detected
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-medium text-ink">Cycle & Symptoms</h2>
      </div>

      <div className="space-y-4">
        {data.symptom_patterns.map((pattern, idx) => (
          <div key={idx} className="bg-white/60 p-4 rounded-2xl">
            <p className="text-sm text-ink leading-relaxed">
              You logged <span className="font-semibold">{pattern.symptom_code.replace("_", " ")}</span> more often
              {pattern.cycle_correlation ? ` during ${pattern.cycle_correlation.toLowerCase()}` : ""} in your recent tracked history.
            </p>
            <div className="flex items-center justify-between mt-3 text-xs text-ink/60">
              <span>Based on {pattern.occurrences} logs</span>
              <span className={`px-2 py-0.5 rounded-full ${
                pattern.confidence === "HIGH" ? "bg-emerald-100 text-emerald-700" :
                pattern.confidence === "MEDIUM" ? "bg-amber-100 text-amber-700" :
                "bg-slate-100 text-slate-700"
              }`}>
                Confidence: {pattern.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-ink/50 bg-white/40 p-3 rounded-xl">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>This is an observed pattern from your logs, not a medical diagnosis.</p>
      </div>
    </div>
  );
}
