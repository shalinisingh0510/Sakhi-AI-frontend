/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type LearningPath } from "@/lib/api";
import { BookOpen, Clock, ArrowRight, Layers } from "lucide-react";

interface LearningPathCardProps {
  path: LearningPath;
  progressPercent?: number;
}

export function LearningPathCard({ path, progressPercent }: LearningPathCardProps) {
  const isStarted = progressPercent !== undefined && progressPercent > 0;
  
  return (
    <Link 
      href={`/learn/paths/${path.slug}`}
      className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#EDE2E7] bg-white shadow-2xs transition-all duration-300 hover:border-berry/40 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] sm:aspect-auto sm:w-52 shrink-0 overflow-hidden bg-slate-100">
        {path.thumbnail_url ? (
          <img
            src={path.thumbnail_url}
            alt={path.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-berry/15 to-purple-500/10 min-h-[140px]">
            <BookOpen className="text-berry/40" size={36} />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-berry shadow-2xs border border-white/60 flex items-center gap-1">
          <Layers size={11} />
          <span>Learning Path</span>
        </div>
        
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
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {path.modules.length} {path.modules.length === 1 ? "Module" : "Modules"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock size={12} />
              <span>Self-paced</span>
            </span>
          </div>

          <h3 className="font-display text-base sm:text-[17px] font-bold text-ink leading-snug transition-colors group-hover:text-berry line-clamp-2">
            {path.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {path.description || "Start this structured curriculum to gain clear, medically validated guidance."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="text-xs font-medium text-slate-500">
            {isStarted ? (
              <span className="text-berry font-semibold">{progressPercent}% Completed</span>
            ) : (
              <span>Certificate on completion</span>
            )}
          </div>
          
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F1F36] group-hover:text-berry transition-colors">
            <span>
              {progressPercent === 100 ? "Review Path" : isStarted ? "Resume Path" : "Start Path"}
            </span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
