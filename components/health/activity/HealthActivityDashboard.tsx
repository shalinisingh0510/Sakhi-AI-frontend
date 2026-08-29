'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ActivityTodayCard } from './ActivityTodayCard';
import { useAuthStore } from '@/lib/auth-store';
import { energyApi, type ActivityDailySummary } from '@/lib/api';

export function HealthActivityDashboard() {
  const { user } = useAuthStore();
  const token = user ? useAuthStore.getState().token : null;
  const [summary, setSummary] = useState<ActivityDailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    if (!token) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await energyApi.getTodaySummary(token, today);
      setSummary(data.activity_summary);
    } catch (err) {
      console.error('Failed to load activity summary', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return <div className="text-center py-10">Loading activity data...</div>;
  }

  if (!token) {
    return <div className="text-center py-10">Please log in to view activity.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <ActivityTodayCard 
          token={token} 
          summary={summary} 
          onActivityLogged={fetchSummary} 
        />
      </div>
    </div>
  );
}
