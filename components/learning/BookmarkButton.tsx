"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { learnApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

interface BookmarkButtonProps {
  contentId: string;
  initialSaved?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ contentId, initialSaved = false, className = "", showLabel = false }: BookmarkButtonProps) {
  const { token } = useAuthStore();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    if (!token || loading) return;
    
    // Optimistic UI
    setIsSaved(!isSaved);
    setLoading(true);
    
    try {
      const res = await learnApi.toggleBookmark(contentId, token);
      setIsSaved(res.saved);
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
      // Revert on error
      setIsSaved(isSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
      className={`flex items-center gap-2 transition-colors ${
        isSaved ? "text-berry" : "text-slate-400 hover:text-berry"
      } ${className}`}
    >
      <Bookmark
        size={20}
        className={isSaved ? "fill-berry" : "fill-transparent"}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
