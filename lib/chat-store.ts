"use client";

import { create } from "zustand";

import { type Citation } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant" | "sakhi";
  content: string;
  citations?: Citation[];
  created_at: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  sessionId: string | null;
  // Actions
  addMessage: (msg: Omit<Message, "id" | "created_at">) => void;
  setMessages: (messages: Message[]) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
  setSessionId: (id: string | null) => void;
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
          created_at: new Date().toISOString(),
        },
      ],
    })),

  setMessages: (messages) => set({ messages }),

  setTyping: (typing) => set({ isTyping: typing }),

  clearChat: () => set({ messages: [], sessionId: null }),

  setSessionId: (id) => set({ sessionId: id }),
}));
