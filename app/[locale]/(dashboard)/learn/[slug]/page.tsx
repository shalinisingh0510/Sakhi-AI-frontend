"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/auth-store";
import { learningApi, type LearningContent, type LearningProgress } from "@/lib/api";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import { LearningArticleRenderer, calculateReadingTime } from "@/components/learning/LearningArticleRenderer";
import { BookmarkButton } from "@/components/learning/BookmarkButton";
import { LearningVideoPlayer } from "@/components/learning/LearningVideoPlayer";
import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";

export default function ContentDetailPage() {
  const params = useParams();
  const id = typeof params.slug === "string" ? params.slug : "";
  const { token } = useAuthStore();

  const [content, setContent] = useState<LearningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  const [relatedItems, setRelatedItems] = useState<LearningContent[]>([]);

  const fetchContent = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const c = await learningApi.getContent(token, id);
      setContent(c);
      // Attempt to fetch progress (may 404 if not started)
      try {
        const progressData = await learningApi.getProgress(token, id);
        setProgress(progressData);
        setCompleted(progressData.completed);
      } catch {
        // No progress record yet
      }
      
      // Fetch related items
      try {
        const r = await learningApi.getRelated(token, id);
        setRelatedItems(r.items);
      } catch {
        // Silently fail related
      }
    } catch {
      setError("This content is not available.");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleMarkComplete = useCallback(async () => {
    if (!token || !content) return;
    setMarkingComplete(true);
    try {
      await learningApi.updateProgress(token, content.id, {
        completed: true,
        progress_percent: 100,
      });
      setCompleted(true);
    } catch {
      // silently fail
    } finally {
      setMarkingComplete(false);
    }
  }, [token, content]);

  // Setup intersection observer for article completion
  const observerTarget = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!content || content.content_type === "VIDEO" || completed || !token) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !markingComplete) {
          handleMarkComplete();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [content, completed, token, markingComplete, handleMarkComplete]);


  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-berry" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose" />
        <p className="text-sm font-semibold text-ink">{error || "Content not found."}</p>
        <Link href="/learn" className="mt-4 inline-block text-sm text-berry hover:underline">
          ← Back to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-berry hover:underline">
          ← Back to Learn
        </Link>
        <BookmarkButton contentId={content.id} showLabel={true} />
      </div>

      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-peach/60 px-2.5 py-0.5 text-xs font-semibold text-berry">
            {content.category}
          </span>
          <span className="rounded-full bg-lavender px-2.5 py-0.5 text-xs font-semibold text-berry/70">
            {content.content_type}
          </span>
          {content.is_featured && (
            <span className="rounded-full bg-moss/20 px-2.5 py-0.5 text-xs font-semibold text-moss">
              ⭐ Featured
            </span>
          )}
        </div>
        <header className="mb-8">
        {content.thumbnail_url && (
          <div className="mb-6 overflow-hidden rounded-3xl aspect-video w-full bg-slate-100 shadow-sm relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.thumbnail_url} alt={content.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-berry/80 mb-3">
          <span className="rounded-full bg-berry/10 px-3 py-1">{content.category}</span>
          {(content.content_type === "ARTICLE" || content.content_type === "POST") && (
            <span className="flex items-center gap-1 text-ink/50 bg-slate-100 rounded-full px-3 py-1">
              <BookOpen className="h-3 w-3" />
              {calculateReadingTime(content.body || [])} min read
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
          {content.title}
        </h1>
        {content.description && (
          <p className="mt-3 text-lg text-ink/70 leading-relaxed">{content.description}</p>
        )}
      </header>
      </div>

      {/* Video Player */}
      {(content.content_type === "VIDEO") && (
        <div className="mb-6">
          <LearningVideoPlayer content={content} progress={progress} />
        </div>
      )}

      {/* Article / Post */}
      {(content.content_type === "ARTICLE" || content.content_type === "POST") && (
        <div className="mb-6">
          <LearningArticleRenderer content={content} />
          {/* Intersection Target for marking completion */}
          <div ref={observerTarget} className="h-4 w-full mt-8" />
        </div>
      )}

      {/* Tags */}
      {content.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-peach/60 bg-peach/20 px-2.5 py-0.5 text-xs text-ink/60">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress / Complete */}
      {completed ? (
        <Card className="flex items-center gap-3 border-moss/30 bg-mint/40 px-5 py-4">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm font-bold text-moss">Completed!</p>
            <p className="text-xs text-ink/50">Great job finishing this lesson.</p>
          </div>
        </Card>
      ) : (
        <Button
          onClick={handleMarkComplete}
          disabled={markingComplete}
          className="w-full"
          id="btn-mark-complete"
        >
          {markingComplete ? (
            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      )}

      {/* Related Learning */}
      {relatedItems.length > 0 && (
        <div className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink">
            Related Learning
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((item) => {
              const href = `/learn/${item.id}`;
              switch (item.content_type) {
                case "VIDEO":
                  return <LearningVideoCard key={item.id} content={item} href={href} />;
                case "ARTICLE":
                  return <LearningArticleCard key={item.id} content={item} href={href} />;
                case "POST":
                  return <LearningPostCard key={item.id} content={item} href={href} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
