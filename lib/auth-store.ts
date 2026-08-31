"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const setLocaleCookie = (locale: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
};

export type AgeGroup = "10-13" | "14-18" | "18+" | "caregiver";
export type SupportedLanguage =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "ta"
  | "te"
  | "kn"
  | "gu"
  | "pa"
  | "or";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  ageGroup: AgeGroup;
  language: SupportedLanguage;
  avatarUrl?: string;
  onboardingComplete: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  completeOnboarding: (ageGroup: AgeGroup, language: SupportedLanguage, name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) =>
        set({ user, token, isAuthenticated: true, isLoading: false }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => {
          if (updates.language) {
            setLocaleCookie(updates.language);
          }
          return {
            user: state.user ? { ...state.user, ...updates } : null,
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      completeOnboarding: (ageGroup, language, name) =>
        set((state) => {
          setLocaleCookie(language);
          return {
            user: state.user
              ? { ...state.user, ageGroup, language, name, onboardingComplete: true }
              : null,
          };
        }),
    }),
    {
      name: "sakhi-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Sync essential auth state to cookies for middleware
if (typeof window !== "undefined") {
  useAuthStore.subscribe((state) => {
    // Self-heal: If authenticated but missing token (corrupted state), force logout
    if (state.isAuthenticated && !state.token) {
      console.warn("Corrupted auth state detected (missing token). Auto-logging out.");
      useAuthStore.getState().logout();
      return;
    }
    
    const minimalState = {
      state: {
        isAuthenticated: state.isAuthenticated,
        user: { onboardingComplete: state.user?.onboardingComplete ?? false }
      }
    };
    document.cookie = `sakhi-auth=${encodeURIComponent(JSON.stringify(minimalState))}; path=/; max-age=31536000; SameSite=Lax`;
  });
  
  // Run once on load to heal any existing corrupted state immediately
  const initialState = useAuthStore.getState();
  if (initialState.isAuthenticated && !initialState.token) {
    initialState.logout();
  }
}
