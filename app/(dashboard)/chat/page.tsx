"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useChatStore } from "@/lib/chat-store";
import { Button } from "@/components/ui/Button";

const QUICK_PROMPTS = [
  "What is the menstrual cycle?",
  "Why do I get cramps?",
  "How to practice good hygiene?",
  "What is puberty?",
  "Tips for mental wellbeing",
  "What are iron-rich foods?",
];

// Simulated Sakhi responses (replace with actual API)
const DEMO_REPLIES: Record<string, string> = {
  default:
    "That's a great question! I'm here to help you understand your body and health. Let me explain in a simple and clear way. Remember, there are no wrong questions — you're doing great by asking. 💛",
  cramp:
    "Menstrual cramps happen because the uterus contracts to shed its lining. This is completely normal! You can try a warm compress, gentle stretching, or staying hydrated. If the pain is very severe, it's always a good idea to speak with a doctor. 🌸",
  cycle:
    "The menstrual cycle is the monthly process your body goes through to prepare for a possible pregnancy. It usually lasts 21–35 days. Each phase — menstrual, follicular, ovulation, and luteal — plays an important role. It's your body's natural rhythm! 💪",
  hygiene:
    "Good hygiene during your period is simple: change your pad or tampon every 4–6 hours, wash the external area with mild soap and water, and wear clean, breathable underwear. Most importantly, be gentle with yourself — your body is working hard! 🌿",
};

function getSakhiReply(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (lower.includes("cramp")) return DEMO_REPLIES.cramp;
  if (lower.includes("cycle") || lower.includes("menstrual"))
    return DEMO_REPLIES.cycle;
  if (lower.includes("hygiene") || lower.includes("clean"))
    return DEMO_REPLIES.hygiene;
  return DEMO_REPLIES.default;
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(content: string) {
    if (!content.trim()) return;
    setInput("");
    addMessage({ role: "user", content });
    setTyping(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);
    addMessage({ role: "sakhi", content: getSakhiReply(content) });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col md:h-[calc(100vh-64px)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-peach/60 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-sm">
          <span className="text-lg">🌸</span>
        </div>
        <div>
          <p className="font-semibold text-ink">Sakhi</p>
          <p className="flex items-center gap-1 text-xs text-moss">
            <span className="h-1.5 w-1.5 rounded-full bg-moss inline-block" />
            Always here for you
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-5xl">🌸</span>
            <div>
              <p className="font-display text-xl font-bold text-ink">
                Hi {user?.name ?? "there"}! I&apos;m Sakhi.
              </p>
              <p className="mt-1 text-sm text-ink/60 max-w-sm mx-auto">
                Your safe space to learn about women's health. Ask me anything — no question is too small or embarrassing.
              </p>
            </div>
            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-full border border-berry/20 bg-white px-4 py-2 text-sm text-ink hover:bg-blush/50 hover:border-berry/40 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "sakhi" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-sm self-end">
                <span className="text-sm">🌸</span>
              </div>
            )}
            <div
              className={[
                "max-w-[75%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-br-sm bg-gradient-to-br from-rose to-berry text-white"
                  : "rounded-bl-sm bg-white border border-peach/60 text-ink shadow-sm",
              ].join(" ")}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blush text-sm font-bold text-berry self-end">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-sm self-end">
              <span className="text-sm">🌸</span>
            </div>
            <div className="rounded-3xl rounded-bl-sm bg-white border border-peach/60 px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-berry/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-peach/60 bg-white/90 px-4 py-3 backdrop-blur-sm">
        {/* Quick prompts when chat has messages */}
        {messages.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="flex-shrink-0 rounded-full border border-berry/20 bg-white px-3 py-1.5 text-xs text-ink hover:bg-blush/50 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sakhi anything…"
            className="flex-1 rounded-full border border-peach/70 bg-white px-5 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry/40"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            size="md"
            className="rounded-full px-5"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-ink/30">
          Sakhi AI is for education only. Always consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
