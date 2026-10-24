"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notificationApi, type ApiNotificationItem } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export const NOTIFICATION_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

const ROTATING_TOPICS = [
  "period_cycle",
  "ovulation",
  "energy",
  "activity",
  "learning",
];

const LOCAL_TOPIC_TEMPLATES: Record<
  string,
  {
    title: string;
    body: string;
    type: ApiNotificationItem["notification_type"];
    action_url: string;
    cta: string;
  }[]
> = {
  period_cycle: [
    {
      title: "🌸 Cycle Rhythm: Luteal Phase Transition",
      body: "Progesterone is elevating to support your cycle. A warm herbal chamomile tea and gentle magnesium ease lower back tension.",
      type: "cycle_alert",
      action_url: "/health/tracker",
      cta: "Log Symptoms",
    },
    {
      title: "🩸 Cycle Health: Menstrual Phase Preparation",
      body: "Your period is estimated to arrive in ~3 days. Keep your period pouch ready with comfortable pads and hydrate well.",
      type: "cycle_alert",
      action_url: "/tools/period-calculator",
      cta: "Open Period Calculator",
    },
  ],
  ovulation: [
    {
      title: "✨ Fertile Window Opening",
      body: "Your biological rhythm indicates entering your fertile window. Estrogen is reaching peak levels, supporting vitality and positive mood.",
      type: "ovulation_alert",
      action_url: "/tools/ovulation-calculator",
      cta: "Check Fertile Days",
    },
  ],
  energy: [
    {
      title: "⚡ Energy Forecast: Estrogen Peak",
      body: "Follicular energy surge! Your metabolic stamina is elevated today—ideal timing for demanding projects and movement.",
      type: "energy_insight",
      action_url: "/dashboard",
      cta: "View Energy Forecast",
    },
    {
      title: "🌙 Restorative Energy Notice",
      body: "Progesterone encourages restorative pacing. Reduce screen exposure 30 minutes before sleep to support your sleep rhythm.",
      type: "energy_insight",
      action_url: "/chat?prompt=How+to+ease+low+energy+during+PMS",
      cta: "Ask Sakhi AI",
    },
  ],
  activity: [
    {
      title: "💧 Hydration Milestone",
      body: "Pelvic organs benefit from steady hydration. Drink a glass of warm water now to reduce water retention and support cellular balance.",
      type: "activity_checkin",
      action_url: "/dashboard",
      cta: "Log Hydration",
    },
    {
      title: "🧘 Pelvic Care & Gentle Movement",
      body: "Take a 5-minute break for gentle child's pose and cat-cow breathing. Spinal decompression eases menstrual tension.",
      type: "activity_checkin",
      action_url: "/learn",
      cta: "Guided Movement",
    },
  ],
  learning: [
    {
      title: "📚 Learning Byte: Seed Cycling Balance",
      body: "Pumpkin and flax seeds in days 1-14, followed by sunflower and sesame seeds in days 15-28, naturally support hormone synthesis.",
      type: "learning_tip",
      action_url: "/learn",
      cta: "Read Clinical Article",
    },
  ],
};

interface NotificationState {
  notifications: ApiNotificationItem[];
  unreadCount: number;
  browserPermission: NotificationPermission;
  lastTickTime: number;
  topicIndex: number;
  activeToast: ApiNotificationItem | null;
  isLoading: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  requestBrowserPermission: () => Promise<void>;
  triggerEngineTick: (topic?: string, force?: boolean) => Promise<void>;
  triggerEngineTickLocal: (topic?: string) => void;
  dismissToast: () => void;
  showToast: (item: ApiNotificationItem) => void;
  publishModule: (title: string, moduleId: string, category?: string, summary?: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      browserPermission: typeof window !== "undefined" && "Notification" in window
        ? Notification.permission
        : "default",
      lastTickTime: 0,
      topicIndex: 0,
      activeToast: null,
      isLoading: false,

      fetchNotifications: async () => {
        const token = useAuthStore.getState().token;
        if (!token) {
          // If guest, calculate unread from local items
          const items = get().notifications;
          set({ unreadCount: items.filter((n) => !n.is_read).length });
          return;
        }

        set({ isLoading: true });
        try {
          const list = await notificationApi.list(token, 1, 30);
          const unreadRes = await notificationApi.getUnreadCount(token);
          set({
            notifications: list,
            unreadCount: unreadRes.unread_count,
            isLoading: false,
          });
        } catch (err) {
          console.warn("Notification fetch warning:", err);
          set({ isLoading: false });
        }
      },

      markAsRead: async (id: string) => {
        const token = useAuthStore.getState().token;
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));

        if (token) {
          try {
            await notificationApi.markRead(token, id);
          } catch (err) {
            console.warn("Failed to sync markRead to backend:", err);
          }
        }
      },

      markAllAsRead: async () => {
        const token = useAuthStore.getState().token;
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          })),
          unreadCount: 0,
        }));

        if (token) {
          try {
            await notificationApi.markAllRead(token);
          } catch (err) {
            console.warn("Failed to sync markAllRead to backend:", err);
          }
        }
      },

      deleteNotification: async (id: string) => {
        const token = useAuthStore.getState().token;
        const target = get().notifications.find((n) => n.id === id);
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: target && !target.is_read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        }));

        if (token) {
          try {
            await notificationApi.deleteNotification(token, id);
          } catch (err) {
            console.warn("Failed to delete notification in backend:", err);
          }
        }
      },

      requestBrowserPermission: async () => {
        if (typeof window !== "undefined" && "Notification" in window) {
          try {
            const perm = await Notification.requestPermission();
            set({ browserPermission: perm });
            if (perm === "granted") {
              new Notification("Sakhi AI Notifications Enabled 🌸", {
                body: "You will receive periodic cycle alerts, energy forecasts, and learning updates every 2 hours.",
                icon: "/favicon.ico",
              });
            }
          } catch (err) {
            console.error("Browser notification permission error:", err);
          }
        }
      },

      dismissToast: () => set({ activeToast: null }),

      showToast: (item: ApiNotificationItem) => {
        set({ activeToast: item });

        // Trigger native browser notification if granted
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            new Notification(item.title, {
              body: item.body,
              icon: "/favicon.ico",
            });
          } catch {
            // Ignore background error
          }
        }

        // Auto-dismiss in 6 seconds
        setTimeout(() => {
          if (get().activeToast?.id === item.id) {
            set({ activeToast: null });
          }
        }, 6000);
      },

      triggerEngineTick: async (topic?: string, force: boolean = false) => {
        const now = Date.now();
        const { lastTickTime, showToast } = get();
        const token = useAuthStore.getState().token;

        // Check 2-hour interval (unless force)
        if (!force && lastTickTime && now - lastTickTime < NOTIFICATION_INTERVAL_MS) {
          return;
        }

        if (token) {
          try {
            const res = await notificationApi.engineTick(token, topic, force);
            if (res.triggered && res.notification) {
              set((state) => ({
                notifications: [res.notification!, ...state.notifications],
                unreadCount: state.unreadCount + 1,
                lastTickTime: now,
              }));
              showToast(res.notification);
            }
          } catch (err) {
            console.warn("Backend engine tick fallback to local:", err);
            // Fallback to local dispatch
            get().triggerEngineTickLocal(topic);
          }
        } else {
          // Local dispatch for guest/anonymous
          get().triggerEngineTickLocal(topic);
        }
      },

      triggerEngineTickLocal: (topic?: string) => {
        const now = Date.now();
        const { topicIndex, showToast, notifications } = get();
        const chosenTopic = topic || ROTATING_TOPICS[topicIndex % ROTATING_TOPICS.length];
        const templates = LOCAL_TOPIC_TEMPLATES[chosenTopic] || LOCAL_TOPIC_TEMPLATES.period_cycle;
        const template = templates[Math.floor(Math.random() * templates.length)];

        const localItem: ApiNotificationItem = {
          id: `local-notif-${now}`,
          user_id: "local-user",
          title: template.title,
          body: template.body,
          notification_type: template.type,
          metadata: {
            action_url: template.action_url,
            cta: template.cta,
            topic: chosenTopic,
            cadence: "2h",
          },
          is_read: false,
          created_at: new Date().toISOString(),
        };

        set({
          notifications: [localItem, ...notifications],
          unreadCount: get().unreadCount + 1,
          lastTickTime: now,
          topicIndex: topicIndex + 1,
        });

        showToast(localItem);
      },

      publishModule: async (title: string, moduleId: string, category: string = "Puberty & Reproductive Health", summary?: string) => {
        const token = useAuthStore.getState().token;
        const { showToast } = get();

        if (token) {
          try {
            const items = await notificationApi.publishModule(token, {
              module_title: title,
              module_id: moduleId,
              category,
              summary,
            });
            if (items.length > 0) {
              set((state) => ({
                notifications: [...items, ...state.notifications],
                unreadCount: state.unreadCount + items.length,
              }));
              showToast(items[0]);
              return;
            }
          } catch (e) {
            console.warn("Publish module notification sync failed, falling back to local:", e);
          }
        }

        // Local fallback item
        const item: ApiNotificationItem = {
          id: `pub-mod-${Date.now()}`,
          user_id: "local",
          title: `🎉 New Module Published: ${title}`,
          body: summary || `A brand new clinical module '${title}' is now available in the Learning Hub. Explore guided lessons and videos today!`,
          notification_type: "module_published",
          metadata: {
            action_url: `/learn?module=${moduleId}`,
            cta: "Start Learning",
            module_id: moduleId,
          },
          is_read: false,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [item, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
        showToast(item);
      },
    }),
    {
      name: "sakhi-notifications",
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50),
        unreadCount: state.unreadCount,
        lastTickTime: state.lastTickTime,
        topicIndex: state.topicIndex,
      }),
    }
  )
);
