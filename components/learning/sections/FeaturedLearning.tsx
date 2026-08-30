"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { PlayCircle, BookOpen, Clock, FileText } from "lucide-react";
import { BookmarkButton } from "@/components/learning/BookmarkButton";

export function FeaturedLearning() {
  const { token } = useAuthStore();
  const [featured, setFeatured] = useState<LearningContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    learningApi.getFeed(token, { is_featured: true })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setFeatured(res.items[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="h-48 md:h-64 md:w-2/5 animate-pulse bg-slate-200" />
          <div className="flex flex-col justify-center p-6 md:w-3/5">
            <div className="mb-4 h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mb-6 h-16 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!featured) return null;

  const isVideo = featured.content_type === "VIDEO" || featured.content_type === "TUTORIAL";
  const icon = isVideo ? <PlayCircle size={16} /> : featured.content_type === "ARTICLE" ? <FileText size={16} /> : <BookOpen size={16} />;

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Image side */}
        <Link 
          href={`/learn/${featured.id}`} 
          className="relative block h-48 md:h-auto md:w-2/5 overflow-hidden"
        >
          {featured.thumbnail_url || featured.media_file_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={featured.thumbnail_url || featured.media_file_url} 
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-berry/20 to-peach/30">
              <span className="text-4xl">🌸</span>
            </div>
          )}
          
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-berry backdrop-blur-sm">
            FEATURED
          </div>
          
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-berry shadow-lg backdrop-blur-sm transition-transform hover:scale-110">
                <PlayCircle size={24} className="ml-1" />
              </div>
            </div>
          )}
        </Link>
        
        {/* Content side */}
        <div className="flex flex-col justify-center p-6 md:w-3/5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {featured.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                {icon}
                <span className="capitalize">{featured.content_type.toLowerCase()}</span>
                {featured.duration_minutes > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <Clock size={12} />
                    <span>{featured.duration_minutes} min</span>
                  </>
                )}
              </div>
            </div>
            <BookmarkButton contentId={featured.id} size="sm" />
          </div>
          
          <Link href={`/learn/${featured.id}`}>
            <h3 className="mb-2 font-display text-2xl font-bold text-ink hover:text-berry transition-colors">
              {featured.title}
            </h3>
            <p className="mb-6 line-clamp-2 text-ink/70">
              {featured.description || "Learn more about this topic..."}
            </p>
          </Link>
          
          <div>
            <Link 
              href={`/learn/${featured.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-berry px-6 py-3 text-sm font-bold text-white transition-all hover:bg-berry/90 hover:shadow-lg hover:shadow-berry/20"
            >
              {isVideo ? "Watch Now" : "Read Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
