/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type LearningContent, learningApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { PlayCircle, Bookmark, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useState } from "react";

interface QuickLearnCardProps {
  content: LearningContent;
  href: string;
}

export function QuickLearnCard({ content, href }: QuickLearnCardProps) {
  const { token } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false); // We don't have is_saved in response directly without bookmarks join, but assuming standard flow

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await learningApi.toggleBookmark(content.id, token);
      setIsSaved(res.saved);
      alert(res.saved ? "Saved to Bookmarks" : "Removed from Bookmarks");
    } catch {
      alert("Failed to update bookmark");
    }
  };

  const getIcon = () => {
    switch (content.content_type) {
      case "VIDEO":
        return <PlayCircle className="text-white drop-shadow-md" size={32} />;
      case "ARTICLE":
        return <FileText className="text-white drop-shadow-md" size={32} />;
      case "POST":
      default:
        return <ImageIcon className="text-white drop-shadow-md" size={32} />;
    }
  };

  const getFormatText = () => {
    if (content.content_type === "VIDEO") {
      return content.duration_minutes ? `${content.duration_minutes} min video` : "Short video";
    }
    if (content.content_type === "ARTICLE") {
      return content.duration_minutes ? `${content.duration_minutes} min read` : "Short read";
    }
    return "Quick post";
  };

  return (
    <Link href={href} className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail */}
      {content.thumbnail_url ? (
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
          <span className="text-6xl text-white/20">S</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center rounded-full bg-black/40 p-2 backdrop-blur-sm">
            {getIcon()}
          </div>
          <button
            onClick={handleSave}
            className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <Bookmark size={20} className={isSaved ? "fill-white" : ""} />
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/90">
            <span className="rounded-md bg-white/20 px-2 py-1 backdrop-blur-sm">
              {content.category}
            </span>
            <span>•</span>
            <span>{getFormatText()}</span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white">
            {content.title}
          </h3>
          {content.medical_review_status === "MEDICALLY_REVIEWED" && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-300 font-medium">
              <CheckCircle size={12} />
              <span>Medically Reviewed</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
