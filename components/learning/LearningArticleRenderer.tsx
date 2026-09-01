"use client";


import { type LearningContent, type ContentBlock } from "@/lib/api";
import { LearningVideoPlayer } from "./LearningVideoPlayer";
import { Info, CheckCircle2, AlertTriangle, HelpCircle, Lightbulb, XCircle } from "lucide-react";

interface LearningArticleRendererProps {
  content: LearningContent;
}

export function calculateReadingTime(blocks: ContentBlock[]): number {
  if (!blocks || blocks.length === 0) return 1;
  const wordCount = blocks.reduce((acc, block) => {
    const textContent = block.content !== undefined ? block.content : (block.text || "");
    if (textContent) {
      return acc + textContent.trim().split(/\s+/).length;
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
        const textContent = block.content !== undefined ? block.content : (block.text || "");
        
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="mt-8 font-display text-2xl font-bold text-ink">
                {block.heading || textContent}
              </h2>
            );
            
          case "paragraph":
          case "text":
            return (
              <div key={i} className="text-base leading-relaxed text-ink/80 whitespace-pre-wrap">
                {block.heading && <h3 className="font-semibold text-lg text-ink mb-2">{block.heading}</h3>}
                {textContent}
              </div>
            );
            
          case "bullet_list":
          case "numbered_list":
          case "list":
            return (
              <div key={i} className="my-4">
                {block.heading && <h3 className="font-semibold text-lg text-ink mb-2">{block.heading}</h3>}
                <ul className="list-inside list-disc space-y-2 text-base leading-relaxed text-ink/80">
                  {textContent.split('\n').filter(Boolean).map((item, idx) => (
                    <li key={idx} className="ml-4">{item.replace(/^[-*0-9.]\s+/, '')}</li>
                  ))}
                </ul>
              </div>
            );

          case "myth_fact":
            return (
              <div key={i} className="my-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-rose/10 p-4 border-b border-slate-100 flex gap-3 items-start">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose mb-1 block">Myth</span>
                    <p className="font-medium text-ink">{block.heading}</p>
                  </div>
                </div>
                <div className="bg-moss/5 p-4 flex gap-3 items-start">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-moss mb-1 block">Fact</span>
                    <p className="text-sm leading-relaxed text-ink/80">{textContent}</p>
                  </div>
                </div>
              </div>
            );

          case "faq":
            return (
              <div key={i} className="my-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-3 mb-3">
                  <HelpCircle className="h-6 w-6 shrink-0 text-indigo-500" />
                  <h3 className="font-semibold text-lg text-ink">{block.heading}</h3>
                </div>
                <div className="pl-9 text-base leading-relaxed text-ink/80">
                  {textContent}
                </div>
              </div>
            );

          case "warning":
            return (
              <div key={i} className="my-6 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-ink shadow-sm">
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  {block.heading && <h4 className="font-semibold text-amber-900 mb-1">{block.heading}</h4>}
                  <div className="text-sm leading-relaxed text-amber-800 font-medium whitespace-pre-wrap">
                    {textContent}
                  </div>
                </div>
              </div>
            );

          case "tip":
          case "callout":
          case "important_box":
            return (
              <div key={i} className="my-6 flex gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-5 text-ink shadow-sm">
                {block.type === "tip" ? <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-indigo-500" /> : <Info className="mt-0.5 h-6 w-6 shrink-0 text-indigo-500" />}
                <div>
                  {block.heading && <h4 className="font-semibold text-indigo-900 mb-1">{block.heading}</h4>}
                  <div className="text-sm leading-relaxed text-indigo-900 whitespace-pre-wrap font-medium">
                    {textContent}
                  </div>
                </div>
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
            
          default:
            return null;
        }
      })}
    </article>
  );
}
