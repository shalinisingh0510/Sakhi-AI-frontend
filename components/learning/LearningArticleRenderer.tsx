"use client";


import { type LearningContent, type ContentBlock } from "@/lib/api";
import { LearningVideoPlayer } from "./LearningVideoPlayer";
import { Info } from "lucide-react";

interface LearningArticleRendererProps {
  content: LearningContent;
}

export function calculateReadingTime(blocks: ContentBlock[]): number {
  if (!blocks || blocks.length === 0) return 1;
  const wordCount = blocks.reduce((acc, block) => {
    if (block.text) {
      return acc + block.text.trim().split(/\s+/).length;
    }
    return acc;
  }, 0);
  
  // Standard reading speed is ~200 WPM
  const minutes = Math.ceil(wordCount / 200);
  return minutes > 0 ? minutes : 1;
}

export function LearningArticleRenderer({ content }: LearningArticleRendererProps) {
  const blocks = content.body || [];

  if (blocks.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500">
        No content available.
      </div>
    );
  }

  return (
    <article className="space-y-6 text-ink">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="mt-8 font-display text-2xl font-bold text-ink">
                {block.text}
              </h2>
            );
            
          case "paragraph":
            return (
              <div key={i} className="text-base leading-relaxed text-ink/80 whitespace-pre-wrap">
                {block.text}
              </div>
            );
            
          case "image":
            return (
              <figure key={i} className="my-6 overflow-hidden rounded-2xl bg-slate-100">
                {block.url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={block.url} alt={block.caption || ""} className="w-full h-auto object-cover max-h-[500px]" />
                )}
                {block.caption && (
                  <figcaption className="p-3 text-center text-xs text-ink/50 bg-slate-50">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
            
          case "video":
            return (
              <div key={i} className="my-6">
                <LearningVideoPlayer 
                  // Construct a mock content object just for the video player block
                  content={{
                    ...content,
                    source_type: block.url && block.url.includes("youtube") ? "YOUTUBE" : "PRIVATE_VIDEO",
                    media_url: block.url,
                    media_file_url: block.url,
                  }} 
                />
                {block.caption && (
                  <p className="mt-2 text-center text-xs text-ink/50">
                    {block.caption}
                  </p>
                )}
              </div>
            );
            
          case "important_box":
            return (
              <div key={i} className="my-6 flex gap-3 rounded-xl border border-rose/30 bg-rose/5 p-4 text-ink">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                <div className="text-sm leading-relaxed text-ink/90 whitespace-pre-wrap font-medium">
                  {block.text}
                </div>
              </div>
            );
            
          default:
            return null;
        }
      })}
    </article>
  );
}
