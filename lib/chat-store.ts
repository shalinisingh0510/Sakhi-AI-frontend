"use client";

import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "sakhi";
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  sessionId: string | null;
  // Actions
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
  setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isTyping: false,
  sessionId: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  clearChat: () => set({ messages: [], sessionId: null }),

  setSessionId: (id) => set({ sessionId: id }),
}));
