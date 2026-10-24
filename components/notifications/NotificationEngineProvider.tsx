"use client";

import React, { useEffect } from "react";
import { useNotificationStore, NOTIFICATION_INTERVAL_MS } from "@/lib/notification-store";
import { NotificationToast } from "@/components/notifications/NotificationToast";

export function NotificationEngineProvider({ children }: { children?: React.ReactNode }) {
  const { fetchNotifications, triggerEngineTick, lastTickTime } = useNotificationStore();

  useEffect(() => {
    // Initial fetch on mount
    fetchNotifications();

    // Check if initial or 2-hour cadence tick is due
    const now = Date.now();
    if (!lastTickTime || now - lastTickTime >= NOTIFICATION_INTERVAL_MS) {
      // Trigger first run or cadence tick
      triggerEngineTick();
    }

    // Check every 60 seconds for 2-hour interval
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const latestLastTick = useNotificationStore.getState().lastTickTime;
      if (!latestLastTick || currentTime - latestLastTick >= NOTIFICATION_INTERVAL_MS) {
        useNotificationStore.getState().triggerEngineTick();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchNotifications, triggerEngineTick, lastTickTime]);

  return (
    <>
      {children}
      <NotificationToast />
    </>
  );
}
