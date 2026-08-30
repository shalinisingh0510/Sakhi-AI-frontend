import { useTranslations } from "next-intl";
import { type ConversationSummary } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface ChatSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ conversations, activeId, onSelect, onNewChat, isOpen, onClose }: ChatSidebarProps) {
  const t = useTranslations("Chat");

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-peach/60 bg-white/95 backdrop-blur-md transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-peach/60 p-4">
            <h2 className="font-display text-lg font-bold text-ink">{t("chatHistory", { fallback: "History" })}</h2>
            <Button variant="ghost" className="md:hidden h-10 w-10 p-2 flex items-center justify-center" onClick={onClose}>
              <CloseIcon className="h-5 w-5 text-ink/60" />
            </Button>
          </div>

          <div className="p-4">
            <Button 
              onClick={() => {
                onNewChat();
                onClose();
              }} 
              className="w-full justify-start gap-2 rounded-full bg-peach/20 text-ink hover:bg-peach/40 border-none shadow-none"
            >
              <PlusIcon className="h-4 w-4 text-berry" />
              {t("newChat", { fallback: "New Chat" })}
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {conversations.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-ink/50">
                {t("noHistory", { fallback: "No previous chats found." })}
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelect(conv.id);
                      onClose();
                    }}
                    className={`w-full flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-colors ${
                      activeId === conv.id ? "bg-blush border border-berry/20" : "hover:bg-peach/10"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="truncate text-sm font-medium text-ink">{conv.title || "New Chat"}</span>
                    </div>
                    <span className="text-xs text-ink/40">
                      {new Date(conv.updated_at).toLocaleDateString()} • {conv.message_count} msgs
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
