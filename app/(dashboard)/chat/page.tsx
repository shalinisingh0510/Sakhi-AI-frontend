"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { useChatStore } from "@/lib/chat-store";
import { useVoice } from "@/lib/use-voice";
import { chatApi } from "@/lib/api";
import { demoDelay, isDemoMode } from "@/lib/api-config";
import { Button } from "@/components/ui/Button";

export default function ChatPage() {
  const { user, token } = useAuthStore();
  const { messages, isTyping, addMessage, setTyping, sessionId, setSessionId } = useChatStore();
  const t = useTranslations("Chat");
  const tA11y = useTranslations("Accessibility");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = t.raw("quickPrompts") as string[];
  const demoReplies = t.raw("demoReplies") as Record<string, string>;

  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
  } = useVoice(user?.language || "en");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  function getSakhiReply(userMsg: string): string {
    const lower = userMsg.toLowerCase();
    if (lower.includes("cramp")) return demoReplies.cramp;
    if (lower.includes("cycle") || lower.includes("menstrual")) return demoReplies.cycle;
    if (lower.includes("hygiene") || lower.includes("clean")) return demoReplies.hygiene;
    return demoReplies.default;
  }

  async function sendMessage(content: string) {
    if (!content.trim()) return;
    setInput("");
    addMessage({ role: "user", content });
    setTyping(true);

    let reply: string;

    try {
      if (!isDemoMode() && token) {
        const response = await chatApi.sendMessage(content, sessionId, token);
        reply = response.reply;
        setSessionId(response.sessionId);
      } else {
        await demoDelay(1200 + Math.random() * 800);
        reply = getSakhiReply(content);
      }
    } catch {
      await demoDelay(600);
      reply = getSakhiReply(content);
    }

    setTyping(false);
    addMessage({ role: "sakhi", content: reply });
    speak(reply);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col md:h-[calc(100vh-64px)]">
      <div className="flex items-center gap-3 border-b border-peach/60 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-sm">
          <span className="text-lg">🌸</span>
        </div>
        <div>
          <p className="font-semibold text-ink">{t("sakhiName")}</p>
          <p className="flex items-center gap-1 text-xs text-moss">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
            {t("status")}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-5xl">🌸</span>
            <div>
              <p className="font-display text-xl font-bold text-ink">
                {t("welcomeHi", { name: user?.name ?? t("welcomeFallback") })}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{t("welcomeSubtitle")}</p>
            </div>
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-full border border-berry/20 bg-white px-4 py-2 text-sm text-ink transition-all hover:border-berry/40 hover:bg-blush/50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "sakhi" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-end rounded-full bg-gradient-to-br from-rose to-berry shadow-sm">
                <span className="text-sm">🌸</span>
              </div>
            )}
            <div
              className={[
                "max-w-[75%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-br-sm bg-gradient-to-br from-rose to-berry text-white"
                  : "rounded-bl-sm border border-peach/60 bg-white text-ink shadow-sm",
              ].join(" ")}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "sakhi" && (
                <button
                  onClick={() => speak(msg.content)}
                  disabled={isSpeaking}
                  className="mt-2 flex items-center gap-1 text-xs text-berry/60 transition-colors hover:text-berry disabled:opacity-50"
                  title={t("readAloud")}
                >
                  {isSpeaking ? (
                    <SpeakerOffIcon className="h-3 w-3" />
                  ) : (
                    <SpeakerIcon className="h-3 w-3" />
                  )}
                  <span>{isSpeaking ? t("speaking") : t("readAloud")}</span>
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-end rounded-full bg-blush text-sm font-bold text-berry">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center self-end rounded-full bg-gradient-to-br from-rose to-berry shadow-sm">
              <span className="text-sm">🌸</span>
            </div>
            <div className="rounded-3xl rounded-bl-sm border border-peach/60 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-4 items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-berry/40"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-peach/60 bg-white/90 px-4 py-3 backdrop-blur-sm">
        {messages.length > 0 && (
          <div className="scrollbar-hide mb-2 flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="flex-shrink-0 rounded-full border border-berry/20 bg-white px-3 py-1.5 text-xs text-ink transition-all hover:bg-blush/50"
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
            placeholder={t("inputPlaceholder")}
            className="flex-1 rounded-full border border-peach/70 bg-white px-5 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-berry/40 focus:outline-none focus:ring-2 focus:ring-berry/30"
          />
          {isSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isTyping}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                isListening
                  ? "border-berry bg-berry/10 text-berry"
                  : "border-peach/70 bg-white text-ink/60 hover:border-berry/40 hover:text-berry"
              }`}
              title={isListening ? t("stopListening") : t("startVoiceInput")}
              aria-label={isListening ? t("stopListening") : t("startVoiceInput")}
            >
              {isListening ? (
                <MicOffIcon className="h-5 w-5" />
              ) : (
                <MicIcon className="h-5 w-5" />
              )}
            </button>
          )}
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            size="md"
            className="rounded-full px-5"
            aria-label={tA11y("sendMessage")}
          >
            <SendIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
        {isListening && (
          <div className="flex items-center justify-center gap-2 text-xs text-berry">
            <span className="h-2 w-2 animate-pulse rounded-full bg-berry" />
            {t("listening")}
          </div>
        )}
        <p className="mt-2 text-center text-xs text-ink/30">{t("disclaimer")}</p>
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

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MicOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function SpeakerOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
