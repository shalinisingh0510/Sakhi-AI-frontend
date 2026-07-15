"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      completeOnboarding: (ageGroup, language, name) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ageGroup, language, name, onboardingComplete: true }
            : null,
        })),
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
