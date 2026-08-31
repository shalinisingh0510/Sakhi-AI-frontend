"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

import { LearnSidebar } from "@/components/learning/sidebar/LearnSidebar";
import { LearnMobileDrawer } from "@/components/learning/sidebar/LearnMobileDrawer";
import { LearnHeader } from "@/components/learning/LearnHeader";
import { LearnRightRail } from "@/components/learning/LearnRightRail";

import { ForTeens } from "@/components/learning/sections/ForTeens";
import { FeaturedLearning } from "@/components/learning/sections/FeaturedLearning";
import { RecommendedContent } from "@/components/learning/sections/RecommendedContent";
import { QuickLearn } from "@/components/learning/sections/QuickLearn";
import { LatestContent } from "@/components/learning/sections/LatestContent";
import { LearningPaths } from "@/components/learning/sections/LearningPaths";

import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";
import { AdSlot } from "@/components/monetization/AdSlot";

const TYPES = [
  { id: "", label: "All" },
  { id: "VIDEO", label: "Videos" },
  { id: "ARTICLE", label: "Articles" },
  { id: "POST", label: "Posts" }
];

export default function LearnPage() {
  const { token, user } = useAuthStore();
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const searchQuery = searchParams?.get("search") || "";
  const typeFilter = searchParams?.get("type") || "";
  const languageFilter = searchParams?.get("language") || "";

  const fetchContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!token) return;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      // For the main feed, we exclude featured content as it's shown in the Featured section
      // However, if we're searching or filtering, we don't exclude featured.
      const isFiltering = !!searchQuery || !!typeFilter;
      
      const res = await learningApi.getFeed(token, {
        type: typeFilter,
        search: searchQuery,
        language: languageFilter,
        page: pageNum,
        is_featured: isFiltering ? undefined : false, // Undefined means all, false means only non-featured
      });
      
      if (isLoadMore) {
        setData(prev => {
          // Filter out duplicates if any
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = res.items.filter(i => !existingIds.has(i.id));
          return [...prev, ...newItems];
        });
      } else {
        setData(res.items);
      }
      
      setHasMore(res.items.length === (res.page_size || 20));
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch learning content", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, typeFilter, searchQuery, languageFilter]);

  // Refetch when filters or search changes
  useEffect(() => {
    fetchContent(1, false);
  }, [fetchContent]);

  if (!token) {
    return <div className="text-center py-10">Please log in to view learning modules.</div>;
  }

  const isSearchingOrFiltering = !!searchQuery || !!typeFilter;

  return (
    <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-8 md:px-8">
      
      {/* Left Sidebar (Desktop) */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">
          <LearnSidebar />
        </div>
      </div>
      
      {/* Mobile Drawer */}
      <LearnMobileDrawer 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <LearnHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        
        {!isSearchingOrFiltering && (
          <>
            <ForTeens />
            <LearningPaths />
            <FeaturedLearning />
            <QuickLearn />
            <RecommendedContent />
            <LatestContent />
            
            <div className="mt-12 mb-6">
              <h2 className="font-display text-2xl font-bold text-ink">More Learning</h2>
              <p className="text-ink/60 mt-1">Explore all available content</p>
            </div>
          </>
        )}

        {/* Filters Area (Shown primarily when filtering/searching) */}
        {isSearchingOrFiltering && (
          <div className="mb-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-ink">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Filtered Content"}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {TYPES.map(type => {
                const isActive = (type.id === "" && !typeFilter) || typeFilter === type.id;
                // We'd use Next.js Link here in a real app, but for simplicity we simulate it
                const href = type.id 
                  ? `/learn?type=${type.id}${searchQuery ? `&search=${searchQuery}` : ""}${languageFilter ? `&language=${languageFilter}` : ""}`
                  : `/learn${searchQuery ? `?search=${searchQuery}` : ""}${languageFilter ? `&language=${languageFilter}` : ""}`;
                  
                return (
                  <a
                    key={type.id}
                    href={href}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-ink text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Feed Area */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-berry/50" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center px-4">
            <p className="text-lg font-semibold text-slate-700">
              No learning content found.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {(languageFilter || user?.language) !== "en" 
                ? "There might not be content available in your selected language yet. Try switching to English." 
                : "Try another topic or search term."}
            </p>
            {isSearchingOrFiltering && (
              <Link
                href="/learn"
                className="mt-4 text-sm font-semibold text-berry hover:underline"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {data.map((item, index) => {
                const href = `/learn/${item.id}`;
                let card = null;
                switch (item.content_type) {
                  case "VIDEO":
                  case "TUTORIAL":
                    card = <LearningVideoCard key={item.id} content={item} href={href} />;
                    break;
                  case "ARTICLE":
                    card = <LearningArticleCard key={item.id} content={item} href={href} />;
                    break;
                  case "POST":
                    card = <LearningPostCard key={item.id} content={item} href={href} />;
                    break;
                  default:
                    return null;
                }
                
                // Inject an AdSlot after every 5 items
                if ((index + 1) % 5 === 0) {
                  return (
                    <div key={`wrapper-${item.id}`} className="contents">
                      {card}
                      <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-3">
                        <AdSlot placementId="learn-feed-in-feed" className="w-full my-4" />
                      </div>
                    </div>
                  );
                }
                return card;
              })}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchContent(page + 1, true)}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-200 disabled:opacity-50"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Right Rail (Desktop) */}
      <div className="hidden w-80 shrink-0 xl:block">
        <LearnRightRail />
      </div>
      
    </div>
  );
}
