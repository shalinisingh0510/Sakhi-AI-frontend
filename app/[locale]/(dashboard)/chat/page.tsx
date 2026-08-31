"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { useChatStore } from "@/lib/chat-store";
import { conversationApi, chatApi, type ConversationSummary } from "@/lib/api";
import { useVoice } from "@/lib/use-voice";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Button } from "@/components/ui/Button";

import { UserMessage } from "@/components/chat/UserMessage";
import { AssistantMessage } from "@/components/chat/AssistantMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatPage() {
  const t = useTranslations("Chat");
  const tA11y = useTranslations("A11y");
  
  const { user, token } = useAuthStore();
  const { messages, isTyping, sessionId, addMessage, setMessages, setTyping, clearChat, setSessionId } = useChatStore();
  // We keep useVoice for TTS, but use useAudioRecorder for STT
  const { speak } = useVoice();
  
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  
  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!token) return;
    try {
      const languageMap: Record<string, string> = { english: "en", hindi: "hi", marathi: "mr" };
      const langCode = user?.language ? languageMap[user.language.toLowerCase()] : "en";
      
      const res = await chatApi.transcribeVoice(audioBlob, token, langCode);
      if (res.text) {
        setInput((prev) => prev ? prev + " " + res.text : res.text);
        setInputMode("voice");
      }
    } catch (err) {
      console.error("Transcription failed", err);
      alert("Transcription failed. Please try again.");
    }
  };
  
  const { state: recordingState, startRecording, stopRecording, cancelRecording } = useAudioRecorder({
    maxDurationSeconds: 60,
    onRecordingComplete: handleRecordingComplete,
    onError: (err) => alert(err),
  });
  
  // Conversations sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on load
  useEffect(() => {
    if (token) {
      conversationApi.getConversations(token).then((list) => {
        setConversations(list);
      }).catch(console.error);
    }
  }, [token]);

  const fetchConversationDetail = async (id: string) => {
    if (!token) return;
    try {
      const detail = await conversationApi.getConversation(id, token);
      setSessionId(detail.conversation.id);
      setMessages(detail.messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        citations: m.citations,
        created_at: m.created_at,
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewChat = () => {
    clearChat();
  };

  // Scroll to bottom whenever messages change or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);



  async function sendMessage(content: string, overrideMode?: "text" | "voice") {
    const trimmed = content.trim();
    if (!trimmed || isTyping) return;
    
    const currentMode = overrideMode || inputMode;
    setInput("");
    setInputMode("text");
    
    // Optimistic user message
    addMessage({ role: "user", content: trimmed });
    setTyping(true);

    try {
      if (!token) throw new Error("Please log in to chat with Sakhi.");
      
      let detail: import("@/lib/api").ApiConversationDetail;
      if (!sessionId) {
        detail = await conversationApi.createConversation(
          trimmed, 
          token, 
          currentMode, 
          user?.language || "english"
        );
        // Add new conversation to list
        setConversations(prev => [detail.conversation, ...prev]);
      } else {
        detail = await conversationApi.sendMessage(
          sessionId, 
          trimmed, 
          token, 
          currentMode
        );
        // Update conversation list timestamp
        setConversations(prev => prev.map(c => c.id === sessionId ? detail.conversation : c));
      }
      
      setSessionId(detail.conversation.id);
      setMessages(detail.messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        citations: m.citations,
        created_at: m.created_at,
      })));
      
      // Auto-speak if voice mode
      if (currentMode === "voice") {
        const lastMsg = detail.messages[detail.messages.length - 1];
        if (lastMsg) speak(lastMsg.content);
      }
    } catch (err: unknown) {
      console.error(err);
      addMessage({
        role: "sakhi",
        content: `I'm having trouble connecting right now. Please try again shortly.`,
      });
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const quickPrompts = [
    t("quickPrompts.symptoms"),
    t("quickPrompts.irregular"),
    t("quickPrompts.nutrition"),
    t("quickPrompts.pain"),
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] overflow-hidden">
      <ChatSidebar 
        conversations={conversations} 
        activeId={sessionId}
        onSelect={fetchConversationDetail} 
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-peach/60 bg-white/80 px-4 py-3 backdrop-blur-sm z-10 shrink-0">
          <Button variant="ghost" className="md:hidden -ml-2 h-10 w-10 p-2" onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon className="h-5 w-5 text-ink/70" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry shadow-sm border border-white">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <div>
            <p className="font-semibold text-ink">{t("sakhiName")}</p>
            <p className="flex items-center gap-1 text-xs text-moss">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
              {t("status")}
            </p>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-6 py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-rose to-berry shadow-lg border-4 border-white flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">S</span>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-ink">
                    {t("welcomeHi", { name: user?.name ?? t("welcomeFallback") })}
                  </p>
                  <p className="text-ink/60 mt-2 max-w-md mx-auto">
                    {t("inputPlaceholder")}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl">
                  {quickPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="rounded-full border border-berry/20 bg-white px-4 py-2.5 text-sm font-medium text-ink transition-all hover:border-berry/40 hover:bg-blush shadow-sm hover:shadow-md"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              msg.role === "user" ? (
                <UserMessage key={msg.id} message={msg} />
              ) : (
                <AssistantMessage 
                  key={msg.id} 
                  message={msg} 
                  isSpeaking={false} 
                  onSpeak={speak} 
                  onCopy={() => {}} 
                />
              )
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start animate-in fade-in duration-300">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-end rounded-full bg-gradient-to-br from-rose to-berry shadow-sm border border-white">
                  <span className="text-sm font-bold text-white">S</span>
                </div>
                <div className="rounded-3xl rounded-bl-sm border border-peach/60 bg-white px-5 py-4 shadow-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-berry/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-berry/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-berry/80 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-peach/60 bg-white/80 backdrop-blur-md p-4 shrink-0">
          <div className="mx-auto max-w-3xl relative">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputMode("text");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder={t("inputPlaceholder")}
                  rows={Math.min(Math.max(input.split("\n").length, 1), 5)}
                  className="w-full resize-none rounded-3xl border border-peach/70 bg-white px-5 py-3.5 pr-12 text-sm text-ink placeholder:text-ink/40 focus:border-berry/50 focus:outline-none focus:ring-2 focus:ring-berry/20 shadow-sm"
                />
                {true && (
                  <button
                    type="button"
                    onClick={recordingState === "RECORDING" ? stopRecording : startRecording}
                    disabled={isTyping || recordingState === "PROCESSING"}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      recordingState === "RECORDING"
                        ? "bg-berry text-white animate-pulse"
                        : "bg-peach/20 text-berry hover:bg-peach/50"
                    }`}
                  >
                    <MicIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isTyping || recordingState === "PROCESSING"}
                className="rounded-full h-12 w-12 p-0 shrink-0 bg-berry hover:bg-berry-dark text-white shadow-md transition-transform active:scale-95 flex items-center justify-center"
                aria-label={tA11y("sendMessage")}
              >
                <SendIcon className="h-5 w-5" aria-hidden="true" />
              </Button>
            </form>
            {(recordingState === "RECORDING" || recordingState === "PROCESSING") && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-xs font-medium text-berry bg-white/90 px-3 py-1 rounded-full shadow-sm border border-peach/50">
                <span className="h-2 w-2 animate-pulse rounded-full bg-berry" />
                {recordingState === "RECORDING" ? t("listening") : "Processing audio..."}
              </div>
            )}
            <p className="mt-2 text-center text-[10px] sm:text-xs text-ink/40">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
