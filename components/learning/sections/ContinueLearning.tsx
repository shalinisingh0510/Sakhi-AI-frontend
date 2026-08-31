"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningSummary } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { PlayCircle, FileText, ArrowRight } from "lucide-react";

export function ContinueLearning() {
  const { token } = useAuthStore();
  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // We cast to our known type since the API type in lib/api.ts uses Record<string, unknown>
    // to avoid forward-reference issues.
    learningApi.getSummary(token)
      .then((res) => setSummary(res as unknown as LearningSummary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // Define full type internally if it's missing from exports
  type Content = NonNullable<LearningSummary["continue_learning"]>;
  const content: Content | undefined = summary?.continue_learning;

  if (!content) return null;

  // Assume progress is 50% if we don't have it directly in the summary response
  // (In a real app, the backend might return the exact progress)
  const progressPercent = 50; 
  const isVideo = content.content_type === "VIDEO" || content.content_type === "TUTORIAL";

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:border-berry/30 hover:shadow-md">
      <Link href={`/learn/${content.id}`} className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {content.thumbnail_url || content.media_file_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={content.thumbnail_url || content.media_file_url} 
              alt={content.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-berry/10 text-berry">
              {isVideo ? <PlayCircle size={24} /> : <FileText size={24} />}
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/10" />
          
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={24} className="text-white drop-shadow-md" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-berry">
            Continue Learning
          </div>
          <h3 className="line-clamp-1 font-semibold text-ink">
            {content.title}
          </h3>
          
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-berry transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500">{progressPercent}%</span>
          </div>
        </div>
        
        <div className="hidden shrink-0 items-center justify-center rounded-full bg-slate-50 p-3 text-ink transition-colors hover:bg-berry hover:text-white md:flex">
          <ArrowRight size={20} />
        </div>
      </Link>
    </div>
  );
}
