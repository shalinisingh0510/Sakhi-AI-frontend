/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type LearningPath } from "@/lib/api";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

interface LearningPathCardProps {
  path: LearningPath;
  progressPercent?: number;
}

export function LearningPathCard({ path, progressPercent }: LearningPathCardProps) {
  const isStarted = progressPercent !== undefined && progressPercent > 0;
  
  return (
    <Link 
      href={`/learn/paths/${path.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-berry/30 hover:shadow-md sm:flex-row"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100 sm:w-48">
        {path.thumbnail_url ? (
          <img
            src={path.thumbnail_url}
            alt={path.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-berry/20 to-purple-500/20">
            <BookOpen className="text-berry/40" size={40} />
          </div>
        )}
        
        {/* Progress bar overlay if started */}
        {isStarted && (
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-200">
            <div 
              className="h-full bg-berry transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-berry/10 px-2 py-1 text-xs font-semibold text-berry">
              Learning Path
            </span>
            <span className="text-xs font-medium text-slate-500">
              {path.modules.length} Modules
            </span>
          </div>
          <h3 className="mb-1 font-display text-lg font-bold text-ink transition-colors group-hover:text-berry">
            {path.title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600">
            {path.description || "Start this structured learning path to gain deep knowledge on the topic."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock size={14} />
            <span>Self-paced</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-bold text-berry">
            {progressPercent === 100 ? (
              "Completed"
            ) : isStarted ? (
              `${progressPercent}% Complete`
            ) : (
              "Start Path"
            )}
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
