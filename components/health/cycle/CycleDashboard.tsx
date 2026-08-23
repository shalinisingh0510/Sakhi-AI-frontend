"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cycleApi, type CurrentCycleResponse, type CycleStatisticsResponse, type MenstrualCycleResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

import { CurrentCycleCard } from "./CurrentCycleCard";
import { PredictionCard } from "./PredictionCard";
import { FertileWindowCard } from "./FertileWindowCard";
import { CycleStatistics } from "./CycleStatistics";
import { CycleHistory } from "./CycleHistory";
import { EmptyState } from "./EmptyState";
import { PeriodLogForm } from "./PeriodLogForm";
import { CycleCalendar } from "./CycleCalendar";

export function CycleDashboard() {
  const t = useTranslations("CycleTracker");
  const token = useAuthStore((s) => s.token);
  
  const [current, setCurrent] = useState<CurrentCycleResponse | null>(null);
  const [stats, setStats] = useState<CycleStatisticsResponse | null>(null);
  const [cycles, setCycles] = useState<MenstrualCycleResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [currData, statsData, cyclesData] = await Promise.all([
        cycleApi.getCurrentCycle(token),
        cycleApi.getStatistics(token),
        cycleApi.listCycles(token, 5),
      ]);
      setCurrent(currData);
      setStats(statsData);
      setCycles(cyclesData);
    } catch (err) {
      console.error("Failed to load cycle data", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogPeriod = async (date: string) => {
    if (!token) return;
    await cycleApi.logPeriod(token, { start_date: date });
    setIsLogging(false);
    setIsLoading(true);
    await fetchData();
  };

  if (isLoading) {
    return <div className="py-12 text-center text-ink/50">{t("loading")}</div>;
  }

  if (isLogging) {
    return (
      <div className="max-w-md mx-auto py-6">
        <h2 className="text-xl font-semibold mb-6">{t("logForm.title")}</h2>
        <PeriodLogForm 
          onSubmit={handleLogPeriod}
          onCancel={() => setIsLogging(false)}
        />
      </div>
    );
  }

  if (!current || current.data_quality === "NO_DATA") {
    return <EmptyState variant="NO_DATA" onLogPeriod={() => setIsLogging(true)} />;
  }

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* 1. Primary Focus: Current Cycle */}
      <CurrentCycleCard 
        cycleDay={current.current_cycle_day}
        latestStart={current.latest_period_start}
        onLogPeriod={() => setIsLogging(true)}
      />

      {/* 2. Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.estimated_next_period && (
          <PredictionCard 
            title={t("estimates.nextPeriod")}
            icon="💧"
            date={current.estimated_next_period.date}
            confidence={current.estimated_next_period.confidence}
          />
        )}
        {current.estimated_ovulation && (
          <PredictionCard 
            title={t("estimates.ovulation")}
            icon="🥚"
            date={current.estimated_ovulation.date}
            confidence={current.estimated_ovulation.confidence}
          />
        )}
      </div>
      
      {current.estimated_fertile_window && (
        <FertileWindowCard 
          start={current.estimated_fertile_window.start}
          end={current.estimated_fertile_window.end}
          confidence={current.estimated_fertile_window.confidence}
        />
      )}

      {/* 3. Insufficient Data Notice */}
      {(current.data_quality === "INSUFFICIENT" || current.data_quality === "LIMITED") && (
        <EmptyState variant={current.data_quality as "INSUFFICIENT" | "LIMITED"} onLogPeriod={() => {}} />
      )}

      {/* 4. Calendar Placeholder */}
      <CycleCalendar />

      {/* 5. Statistics */}
      {stats && <CycleStatistics stats={stats} />}

      {/* 6. History */}
      <CycleHistory cycles={cycles} />
    </div>
  );
}
