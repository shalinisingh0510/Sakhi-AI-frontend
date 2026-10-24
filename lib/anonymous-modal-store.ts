"use client";

import { create } from "zustand";

export type AnonymousModalTab = "shield" | "restore" | "convert";

interface AnonymousModalState {
  isOpen: boolean;
  activeTab: AnonymousModalTab;
  openModal: (tab?: AnonymousModalTab) => void;
  closeModal: () => void;
  setActiveTab: (tab: AnonymousModalTab) => void;
}

export const useAnonymousModalStore = create<AnonymousModalState>((set) => ({
  isOpen: false,
  activeTab: "shield",
  openModal: (tab = "shield") => set({ isOpen: true, activeTab: tab }),
  closeModal: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
