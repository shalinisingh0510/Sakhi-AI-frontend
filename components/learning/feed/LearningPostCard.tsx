import Link from "next/link";
import { type LearningContent } from "@/lib/api";

export function LearningPostCard({ content, href }: { content: LearningContent; href: string }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        {/* Full Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {content.thumbnail_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={content.thumbnail_url} 
              alt={content.title} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <span className="text-4xl">🖼️</span>
            </div>
          )}
        </div>
        {/* Caption */}
        <div className="flex flex-col p-4 bg-white">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="text-berry/80">{content.category.replace("-", " ")}</span>
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">
            {content.title}
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px]">
              👩‍⚕️
            </div>
            <span className="text-[11px] text-slate-500 font-medium truncate">Sakhi Health</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
