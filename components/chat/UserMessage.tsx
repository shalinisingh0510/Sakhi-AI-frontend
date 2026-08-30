import { type Message } from "@/lib/chat-store";
import { useAuthStore } from "@/lib/auth-store";

export function UserMessage({ message }: { message: Message }) {
  const { user } = useAuthStore();
  return (
    <div className="flex gap-2 justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[75%] rounded-3xl px-4 py-3 text-sm leading-relaxed rounded-br-sm bg-gradient-to-br from-rose to-berry text-white shadow-sm">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-end rounded-full bg-blush text-sm font-bold text-berry shadow-sm border border-white">
        {user?.name?.[0]?.toUpperCase() ?? "U"}
      </div>
    </div>
  );
}

