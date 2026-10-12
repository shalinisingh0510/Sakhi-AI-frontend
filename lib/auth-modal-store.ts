"use client";

import { create } from "zustand";

export type AuthPromptReason = "health" | "bookmark" | "progress" | "chat" | "general";

interface AuthModalState {
  isOpen: boolean;
  reason: AuthPromptReason;
  openAuthModal: (reason?: AuthPromptReason) => void;
  closeAuthModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  reason: "general",
  openAuthModal: (reason = "general") => set({ isOpen: true, reason }),
  closeAuthModal: () => set({ isOpen: false }),
}));
