"use client";

import { useEffect, useRef } from "react";
import { learningApi, type LearningContent, type LearningProgress } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

export function LearningVideoPlayer({ content, progress }: { content: LearningContent; progress?: LearningProgress | null }) {
  const { token } = useAuthStore();

  // Use the backend-provided URL if available, otherwise fetch it.
  // Actually, Phase 5/6 backend change injects `media_file_url` into the response for PRIVATE_VIDEO.
  const videoUrl = content.source_type === "PRIVATE_VIDEO" ? content.media_file_url : content.media_url;

  const lastSavedPercent = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Resume logic
  useEffect(() => {
    if (progress && progress.watch_time_seconds > 0 && !progress.completed && videoRef.current) {
      videoRef.current.currentTime = progress.watch_time_seconds;
      lastSavedPercent.current = progress.progress_percent;
    }
  }, [progress]);

  const saveProgress = (percent: number, force: boolean = false) => {
    // Only save if it's a significant milestone (e.g., 25, 50, 75, 100) or force
    // To prevent spamming, we check if we've passed a quartile.
    const getQuartile = (p: number) => Math.floor(p / 25) * 25;
    
    const currentQ = getQuartile(percent);
    const lastQ = getQuartile(lastSavedPercent.current);

    if ((currentQ > lastQ && currentQ > 0) || force || percent === 100) {
      if (percent > lastSavedPercent.current) {
        lastSavedPercent.current = percent;
        if (token) {
          const watchTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
          learningApi.updateProgress(token, content.id, {
            completed: percent === 100,
            progress_percent: percent,
            watch_time_seconds: watchTime,
          }).catch(() => {});
        }
      }
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    if (video.duration > 0) {
      const percent = Math.floor((video.currentTime / video.duration) * 100);
      saveProgress(percent);
    }
  };

  const handleEnded = () => {
    saveProgress(100, true);
  };

  if (content.source_type === "YOUTUBE" && videoUrl) {
    const getEmbedId = (u: string) => {
      const m = u.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/);
      return m ? m[1] : null;
    };
    const videoId = getEmbedId(videoUrl);
    
    if (!videoId) {
      return (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-red-500">
          Invalid YouTube URL
        </div>
      );
    }

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

  if (content.source_type === "PRIVATE_VIDEO") {
    if (!videoUrl) {
       return (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
          <Loader2 className="mb-2 h-6 w-6 animate-spin text-berry" />
          Loading video...
        </div>
      );
    }

    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md">
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full"
          controls
          controlsList="nodownload"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          poster={content.thumbnail_url}
        >
          Your browser does not support HTML5 video.
        </video>
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
      Unsupported video source.
    </div>
  );
}
