import { useState } from "react";
import { type Message } from "@/lib/chat-store";
import { CitationCard } from "./CitationCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";

interface AssistantMessageProps {
  message: Message;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onCopy: (text: string) => void;
  onFeedback?: (helpful: boolean) => void;
}

export function AssistantMessage({ message, isSpeaking, onSpeak, onCopy, onFeedback }: AssistantMessageProps) {
  const t = useTranslations("Chat");
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (helpful: boolean) => {
    if (feedbackGiven !== null) return;
    setFeedbackGiven(helpful);
    if (onFeedback) onFeedback(helpful);
  };

  // Determine if there is a safety warning/emergency in the response (Phase 11)
  // We can look for specific keywords or if the backend passed a safety_status (currently relies on content)
  const isEmergency = message.content.toLowerCase().includes("emergency") || message.content.toLowerCase().includes("urgent medical attention");

  return (
    <div className="flex gap-2 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-end rounded-full bg-gradient-to-br from-rose to-berry shadow-sm border border-white">
        <span className="text-sm font-bold text-white">S</span>
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-bl-sm border border-peach/60 bg-white text-ink shadow-sm overflow-hidden">
        
        {isEmergency && (
          <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center gap-2">
            <span className="text-red-600 text-sm font-semibold">⚠️ {t("medicalEmergencyWarning", { fallback: "Important Medical Notice" })}</span>
          </div>
        )}

        <div className="px-5 py-4 text-sm leading-relaxed prose prose-sm prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 prose-a:text-berry prose-li:my-0.5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/50 border-t border-peach/30">
            <p className="text-xs font-medium text-ink/50 uppercase tracking-wider mb-2">{t("sources", { fallback: "Sources" })}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.citations.map((cit, idx) => (
                <CitationCard key={cit.id || idx} citation={cit} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 px-4 py-2 border-t border-peach/20 bg-slate-50/30">
          <button
            onClick={() => onSpeak(message.content)}
            disabled={isSpeaking}
            className="flex items-center gap-1 px-2 py-1 text-xs text-berry/60 transition-colors hover:bg-peach/20 hover:text-berry rounded-md disabled:opacity-50"
            title={t("readAloud")}
          >
            {isSpeaking ? (
              <SpeakerOffIcon className="h-3.5 w-3.5" />
            ) : (
              <SpeakerIcon className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isSpeaking ? t("speaking") : t("readAloud")}</span>
          </button>
          
          <div className="flex-1" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs text-berry/60 transition-colors hover:bg-peach/20 hover:text-berry rounded-md"
            title={t("copy")}
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          </button>

          <div className="h-4 w-px bg-peach/50 mx-1" />

          <button
            onClick={() => handleFeedback(true)}
            disabled={feedbackGiven !== null}
            className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded-md ${
              feedbackGiven === true ? "text-berry bg-peach/30" : "text-berry/60 hover:bg-peach/20 hover:text-berry"
            } disabled:opacity-50 disabled:hover:bg-transparent`}
          >
            <ThumbsUpIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            disabled={feedbackGiven !== null}
            className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded-md ${
              feedbackGiven === false ? "text-red-500 bg-red-50" : "text-berry/60 hover:bg-peach/20 hover:text-red-500"
            } disabled:opacity-50 disabled:hover:bg-transparent`}
          >
            <ThumbsDownIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Icons
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2" />
    </svg>
  );
}

