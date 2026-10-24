"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_ANONYMOUS_TRIAL_SECONDS = 10 * 60; // 10 minutes free trial

interface AnonymousTimerState {
  totalTrialSeconds: number;
  secondsRemaining: number;
  isExpired: boolean;
  isPaid: boolean;
  isPaywallOpen: boolean;
  selectedPlan: "monthly" | "annual";
  
  // Actions
  tick: () => void;
  openPaywall: () => void;
  closePaywall: () => void;
  setSelectedPlan: (plan: "monthly" | "annual") => void;
  markPaid: () => void;
  resetTrial: () => void;
  checkAndTriggerExpiration: () => boolean;
}

export const useAnonymousTimerStore = create<AnonymousTimerState>()(
  persist(
    (set, get) => ({
      totalTrialSeconds: DEFAULT_ANONYMOUS_TRIAL_SECONDS,
      secondsRemaining: DEFAULT_ANONYMOUS_TRIAL_SECONDS,
      isExpired: false,
      isPaid: false,
      isPaywallOpen: false,
      selectedPlan: "monthly",

      tick: () => {
        const { isPaid, secondsRemaining } = get();
        if (isPaid) return;

        if (secondsRemaining <= 1) {
          set({ secondsRemaining: 0, isExpired: true });
        } else {
          set({ secondsRemaining: secondsRemaining - 1 });
        }
      },

      openPaywall: () => set({ isPaywallOpen: true }),
      closePaywall: () => set({ isPaywallOpen: false }),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),

      markPaid: () =>
        set({
          isPaid: true,
          isExpired: false,
          isPaywallOpen: false,
        }),

      resetTrial: () =>
        set({
          secondsRemaining: DEFAULT_ANONYMOUS_TRIAL_SECONDS,
          isExpired: false,
          isPaid: false,
        }),

      checkAndTriggerExpiration: () => {
        const { isPaid, secondsRemaining } = get();
        if (isPaid) return false;
        if (secondsRemaining <= 0) {
          set({ isExpired: true, isPaywallOpen: true });
          return true;
        }
        return false;
      },
    }),
    {
      name: "sakhi-anon-timer",
      partialize: (state) => ({
        secondsRemaining: state.secondsRemaining,
        isExpired: state.isExpired,
        isPaid: state.isPaid,
        selectedPlan: state.selectedPlan,
      }),
    }
  )
);
