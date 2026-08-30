import Link from "next/link";
import { type LearningContent } from "@/lib/api";
import { PlayCircle } from "lucide-react";
import { BookmarkButton } from "@/components/learning/BookmarkButton";
import { MedicalReviewBadge } from "@/components/learning/MedicalReviewBadge";

export function LearningVideoCard({ content, href }: { content: LearningContent; href: string }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {content.thumbnail_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={content.thumbnail_url} 
              alt={content.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <span className="text-4xl">🎥</span>
            </div>
          )}
          {/* Overlay Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
              <PlayCircle className="h-8 w-8 text-white" fill="currentColor" />
            </div>
          </div>
          {/* Duration Badge */}
          {content.duration_minutes > 0 && (
            <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {content.duration_minutes} min
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="text-berry/80">{content.category.replace("-", " ")}</span>
            <MedicalReviewBadge status={content.medical_review_status} />
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-ink leading-tight group-hover:text-berry transition-colors">
            {content.title}
          </h3>
          <div className="mt-auto pt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
                👩‍⚕️
              </div>
              <span className="text-xs text-slate-500 font-medium truncate">Sakhi Health</span>
            </div>
            <BookmarkButton contentId={content.id} className="z-10 bg-slate-50 p-1.5 rounded-full hover:bg-slate-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}
