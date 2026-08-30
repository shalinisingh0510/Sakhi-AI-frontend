"use client";

import Image from "next/image";
import type { Sponsor } from "@/lib/api";

interface SponsorBadgeProps {
  sponsor: Sponsor;
  className?: string;
}

export function SponsorBadge({ sponsor, className = "" }: SponsorBadgeProps) {
  if (sponsor.status !== "ACTIVE") return null;

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-700/50 rounded-full shadow-sm transition-transform hover:-translate-y-0.5 ${className}`}>
      {sponsor.logo_url ? (
        <div className="relative w-6 h-6 flex-shrink-0">
          <Image
            src={sponsor.logo_url}
            alt={`${sponsor.name} logo`}
            fill
            className="object-contain rounded-sm"
          />
        </div>
      ) : (
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-yellow-200 dark:bg-yellow-700/50 rounded-sm">
          <span className="text-yellow-700 dark:text-yellow-300 text-[10px] font-bold">
            {sponsor.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-yellow-600 dark:text-yellow-500/80 leading-none mb-0.5">
          Sponsored by
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
          {sponsor.name}
        </span>
      </div>
    </div>
  );
}
