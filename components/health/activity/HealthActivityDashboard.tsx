'use client';

import React from 'react';
import { ActivityTodayCard } from './ActivityTodayCard';

export function HealthActivityDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <ActivityTodayCard />
      </div>
    </div>
  );
}
