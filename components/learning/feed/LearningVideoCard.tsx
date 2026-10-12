import Link from "next/link";
import { type LearningContent } from "@/lib/api";
import { PlayCircle, Clock, Video, ArrowRight, ShieldCheck, Languages } from "lucide-react";
import { BookmarkButton } from "@/components/learning/BookmarkButton";
import { getCategoryBadge } from "./LearningArticleCard";

export function LearningVideoCard({ content, href }: { content: LearningContent; href: string }) {
  const badge = getCategoryBadge(content.category, content.audience);

  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-[#EDE2E7] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-berry/40 hover:-translate-y-0.5">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          {content.thumbnail_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={content.thumbnail_url} 
              alt={content.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <Video className="h-10 w-10 text-slate-300" />
            </div>
          )}

          {/* Overlay Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 sm:opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-transform group-hover:scale-110">
              <PlayCircle className="h-6 w-6 text-berry" fill="currentColor" />
            </div>
          </div>

          {/* Floating Pill Top-Left */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-tight shadow-2xs backdrop-blur-sm ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          {/* Floating Pill Top-Right */}
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs border border-white/70">
              <Languages size={11} className="text-berry" />
              <span>2 Langs</span>
            </span>
          </div>

          {/* Video Duration */}
          {content.duration_minutes > 0 && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {content.duration_minutes}m
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-4.5">
          {/* Meta Row */}
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              <span>{content.duration_minutes || 5} min</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Video size={11} className="text-berry" /> Video Hub
              </span>
            </div>
            {content.medical_review_status === "MEDICALLY_REVIEWED" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ShieldCheck size={11} /> Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 font-display text-[15px] font-bold text-ink leading-snug group-hover:text-berry transition-colors">
            {content.title}
          </h3>

          {/* Description */}
          {content.description && (
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 leading-relaxed">
              {content.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F1F36] group-hover:text-berry transition-colors">
              Watch Video <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
            <BookmarkButton contentId={content.id} size={16} className="p-1 text-slate-400 hover:text-berry" />
          </div>
        </div>
      </div>
    </Link>
  );
}
