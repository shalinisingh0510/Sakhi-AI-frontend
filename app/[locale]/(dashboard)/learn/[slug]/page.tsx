"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/auth-store";
import { learningApi, type LearningContent, type ContentBlock, type LearningProgress } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="text-xl font-bold text-ink mt-6 first:mt-0">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="text-sm leading-relaxed text-ink/80">
                {block.text}
              </p>
            );
          case "important_box":
            return (
              <div key={i} className="rounded-2xl border border-berry/20 bg-blush/50 px-5 py-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-berry">
                  Important
                </p>
                <p className="text-sm text-ink/80">{block.text}</p>
              </div>
            );
          case "image":
            return (
              <figure key={i} className="overflow-hidden rounded-2xl">
                {block.url && (
                  <img src={block.url} alt={block.caption || ""} className="w-full object-cover" />
                )}
                {block.caption && (
                  <figcaption className="mt-2 text-center text-xs text-ink/50">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "video":
            return (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video bg-black">
                <iframe
                  src={block.url}
                  className="h-full w-full"
                  allowFullScreen
                  title={block.caption || "video"}
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function YouTubeEmbed({ url }: { url: string }) {
  const getEmbedId = (u: string) => {
    const m = u.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_\-]{11})/);
    return m ? m[1] : null;
  };
  const videoId = getEmbedId(url);
  if (!videoId) return <p className="text-sm text-red-500">Invalid YouTube URL</p>;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video"
      />
    </div>
  );
}

export default function ContentDetailPage() {
  const params = useParams();
  const id = typeof params.slug === "string" ? params.slug : "";
  const { token } = useAuthStore();

  const [content, setContent] = useState<LearningContent | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchContent = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const c = await learningApi.getContent(token, id);
      setContent(c);
      // Attempt to fetch progress (may 404 if not started)
      try {
        const p = await learningApi.getProgress(token, id);
        setProgress(p);
        setCompleted(p.completed);
      } catch {
        // No progress record yet
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

  async function handleMarkComplete() {
    if (!token || !content) return;
    setMarkingComplete(true);
    try {
      const p = await learningApi.updateProgress(token, content.id, {
        completed: true,
        progress_percent: 100,
      });
      setProgress(p);
      setCompleted(true);
    } catch {
      // silently fail
    } finally {
      setMarkingComplete(false);
    }
  }

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
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1 text-sm text-berry hover:underline">
        ← Back to Learn
      </Link>

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
        <h1 className="font-display text-3xl font-bold text-ink">{content.title}</h1>
        {content.description && (
          <p className="mt-2 text-sm text-ink/60">{content.description}</p>
        )}
        {content.duration_minutes > 0 && (
          <p className="mt-1 text-xs text-ink/40">{content.duration_minutes} min</p>
        )}
      </div>

      {/* YouTube */}
      {content.source_type === "YOUTUBE" && content.media_url && (
        <div className="mb-6">
          <YouTubeEmbed url={content.media_url} />
        </div>
      )}

      {/* Private Video */}
      {content.source_type === "PRIVATE_VIDEO" && content.media_file_id && (
        <div className="mb-6 rounded-2xl border border-berry/20 bg-lavender/50 p-4 text-center text-sm text-ink/60">
          🔒 Private video — streaming link is generated securely on demand.
        </div>
      )}

      {/* Article/Post Body */}
      {content.body && content.body.length > 0 && (
        <div className="mb-6">
          <ArticleBody blocks={content.body as ContentBlock[]} />
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
    </div>
  );
}
