"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

interface AdSlotProps {
  placementId: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

export function AdSlot({ placementId, className = "", format = "auto", responsive = true }: AdSlotProps) {
  const [adBlocked, setAdBlocked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsClient(true);
    // Simple ad blocker detection
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    try {
      document.body.appendChild(testAd);
      window.setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdBlocked(true);
        }
        testAd.remove();
      }, 100);
    } catch {
      setAdBlocked(true);
    }
  }, []);

  // Teen protection (Phase 9)
  const isTeen = user?.ageGroup === "10-13" || user?.ageGroup === "14-18";

  if (!isClient) return null;

  // In development, show a beautiful placeholder instead of real ads
  if (process.env.NODE_ENV !== "production") {
    return (
      <div className={`w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 border border-dashed border-gray-300 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${className}`} style={{ minHeight: "120px" }}>
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2">Advertisement</span>
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            {placementId} ({format})
          </p>
          {isTeen && (
            <span className="mt-2 text-xs text-primary-500 font-medium px-2 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              Safe Teen Ad
            </span>
          )}
        </div>
      </div>
    );
  }

  if (adBlocked) {
    // Graceful fallback for ad blocker, transparent so it doesn't break UI layout
    return <div className={`ad-fallback-container opacity-0 ${className}`} style={{ height: "1px" }} />;
  }

  // Real AdSense injection logic (production)
  return (
    <div className={`sakhi-ad-container overflow-hidden rounded-xl ${className}`}>
      <span className="text-[10px] uppercase text-gray-400 block mb-1">Sponsored</span>
      {/* The actual ad injection will rely on the global script added in _document or layout. */}
      {/* We use a wrapper that the ad network targets. */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={placementId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
