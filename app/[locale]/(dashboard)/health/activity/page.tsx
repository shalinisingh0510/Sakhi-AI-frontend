import { Metadata } from 'next';
import { HealthActivityDashboard } from '@/components/health/activity/HealthActivityDashboard';

export const metadata: Metadata = {
  title: 'Activity Tracking | Sakhi AI',
  description: 'Track your daily activity and estimated energy expenditure.',
};

export default function ActivityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
      </div>
      <HealthActivityDashboard />
    </div>
  );
}
