import Link from "next/link";
import { type LearningContent } from "@/lib/api";
import { BookOpen, ArrowRight } from "lucide-react";
import { calculateReadingTime } from "../LearningArticleRenderer";
import { BookmarkButton } from "@/components/learning/BookmarkButton";
import { MedicalReviewBadge } from "@/components/learning/MedicalReviewBadge";

export function LearningArticleCard({ content, href }: { content: LearningContent; href: string }) {
  const readTime = calculateReadingTime(content.body || []);

  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {content.thumbnail_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={content.thumbnail_url} 
              alt={content.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <span className="text-4xl">📄</span>
            </div>
          )}
          {/* Article Badge */}
          <div className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-md flex items-center gap-1.5">
            <BookOpen className="h-3 w-3 text-berry" /> Article
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="text-berry/80">{content.category.replace("-", " ")}</span>
            <div className="flex items-center gap-2">
              <MedicalReviewBadge status={content.medical_review_status} />
              <span className="text-slate-400 font-medium lowercase tracking-normal hidden sm:inline">{readTime} min read</span>
            </div>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-ink leading-tight group-hover:text-berry transition-colors">
            {content.title}
          </h3>
          {content.description && (
            <p className="line-clamp-2 text-sm text-slate-500 mb-4">
              {content.description}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">
                👩‍⚕️
              </div>
              <span className="text-xs text-slate-500 font-medium truncate">Sakhi Health</span>
            </div>
            <div className="flex items-center gap-3">
              <BookmarkButton contentId={content.id} className="z-10 bg-slate-50 p-1.5 rounded-full hover:bg-slate-100" />
              <div className="flex items-center gap-1 text-sm font-semibold text-berry group-hover:underline">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
