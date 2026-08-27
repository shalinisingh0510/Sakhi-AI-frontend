"use client";

import { useEffect, useState } from "react";
import { longitudinalApi, LongitudinalTrendsResponse } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowUp, ArrowDown, Minus, Activity } from "lucide-react";

export function WellnessTrendsCard() {
  const { token } = useAuth();
  const [data, setData] = useState<LongitudinalTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    longitudinalApi.getTrends(token, "30d")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Failed to load trends", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white/40 p-6 rounded-3xl animate-pulse flex items-center justify-center h-40">
        <span className="text-ink/50 text-sm">Loading trends...</span>
      </div>
    );
  }

  if (!data || data.trends.length === 0) {
    return (
      <div className="bg-white/40 p-6 rounded-3xl text-center">
        <Activity className="w-8 h-8 mx-auto text-ink/30 mb-2" />
        <h3 className="text-sm font-medium text-ink">Not enough data yet</h3>
        <p className="text-xs text-ink/60 mt-1">
          Keep tracking to discover personal patterns over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-blush/20 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-medium text-ink">Your Wellness Trends</h2>
          <p className="text-xs text-ink/60 mt-1">Based on your logged data (Last 30 Days)</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.trends.map((trend, idx) => (
          <div key={idx} className="bg-white/40 p-3 rounded-2xl border border-blush/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink capitalize">{trend.domain}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-ink/60">Avg: {trend.current_value !== null ? trend.current_value : "--"} {trend.unit}</span>
                {trend.confidence === "INSUFFICIENT_DATA" && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Insufficient Data</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              {trend.direction === "INCREASING" && (
                <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUp className="w-3 h-3 mr-1" /> Increasing
                </div>
              )}
              {trend.direction === "DECREASING" && (
                <div className="flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  <ArrowDown className="w-3 h-3 mr-1" /> Decreasing
                </div>
              )}
              {trend.direction === "STABLE" && (
                <div className="flex items-center text-xs text-ink/60 bg-ink/5 px-2 py-1 rounded-full">
                  <Minus className="w-3 h-3 mr-1" /> Stable
                </div>
              )}
              {trend.direction === "INSUFFICIENT_DATA" && (
                <div className="text-xs text-ink/40">--</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-blush/20 flex justify-between items-center text-xs text-ink/60">
        <span>Tracking Completeness</span>
        <span className="font-medium">{(data.completeness.overall_score * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
