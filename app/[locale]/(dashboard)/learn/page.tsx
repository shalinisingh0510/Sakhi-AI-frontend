"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { learningApi, authApi, type LearningContent } from "@/lib/api";
import { normalizeUser } from "@/lib/api-config";
import { useAuthStore } from "@/lib/auth-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { Loader2, ChevronDown, Sparkles, Shield } from "lucide-react";

import { LearnSidebar } from "@/components/learning/sidebar/LearnSidebar";
import { LearnMobileDrawer } from "@/components/learning/sidebar/LearnMobileDrawer";
import { LearnHeader } from "@/components/learning/LearnHeader";
import { ContinueJourneySection } from "@/components/learning/sections/ContinueJourneySection";
import { LearningPaths } from "@/components/learning/sections/LearningPaths";

import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";
import { AdSlot } from "@/components/monetization/AdSlot";

const TYPES = [
  { id: "", label: "All Content" },
  { id: "ARTICLE", label: "Articles" },
  { id: "VIDEO", label: "Videos" },
  { id: "POST", label: "Infographics" },
];

function LearnPageContent() {
  const { token, user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  const searchQuery = searchParams?.get("search") || "";
  const typeFilter = searchParams?.get("type") || "";
  const languageFilter = searchParams?.get("language") || locale;

  const fetchContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await learningApi.getFeed(token || "", {
        type: typeFilter,
        search: searchQuery,
        language: languageFilter,
        page: pageNum,
        limit: 24,
      });
      
      if (isLoadMore) {
        setData(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = res.items.filter(i => !existingIds.has(i.id));
          return [...prev, ...newItems];
        });
      } else {
        setData(res.items);
      }
      
      setHasMore(res.items.length === (res.page_size || 24));
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

  const handleTypeFilter = (newType: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (newType) {
      params.set("type", newType);
    } else {
      params.delete("type");
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Client-side sorting on loaded items
  const sortedData = useMemo(() => {
    const items = [...data];
    if (sortBy === "newest") {
      return items.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
    }
    if (sortBy === "duration") {
      return items.sort((a, b) => (a.duration_minutes || 5) - (b.duration_minutes || 5));
    }
    if (sortBy === "az") {
      return items.sort((a, b) => a.title.localeCompare(b.title));
    }
    return items;
  }, [data, sortBy]);

  const isSearchingOrFiltering = !!searchQuery || !!typeFilter;

  return (
    <div className="mx-auto flex max-w-[1536px] gap-8 px-4 py-6 md:px-8">
      {/* Left Sidebar (Desktop) - Kept intact as requested */}
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
        {/* Grounded Health Sanctuary Hero Banner */}
        <LearnHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        
        {!isSearchingOrFiltering && (
          <>
            {/* Continue Your Journey & Weekly Rhythm (Dual-card Stitch row) */}
            <ContinueJourneySection />

            {/* Guided Learning Paths */}
            <LearningPaths limit={2} />
          </>
        )}

        {user?.isAnonymous && (
          <div className="mt-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 p-3.5 text-xs text-emerald-100 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Sakhi AI Anonymous Learning Active:</strong> Read clinical articles and watch puberty guides with zero identity tracking.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => useAnonymousModalStore.getState().openModal("shield")}
                className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                View Key
              </button>
            </div>
          </div>
        )}

        {!token && (
          <div className="mt-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-peach/80 bg-gradient-to-r from-blush/50 via-white to-peach/30 p-4 text-xs sm:text-sm text-ink shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="leading-snug">
                <strong>Explore Freely:</strong> Learn about cycles, hormones, and wellness in private Anonymous Mode. No account or email needed.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  authApi.createAnonymous().then((res) => {
                    const normalized = normalizeUser(res.user, "");
                    normalized.onboardingComplete = true;
                    useAuthStore.getState().login(normalized, res.access_token);
                    useAnonymousModalStore.getState().openModal("shield");
                  });
                }}
                className="rounded-xl border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-all"
              >
                Learn Anonymously 🛡️
              </button>
              <button
                type="button"
                onClick={() => useAuthModalStore.getState().openAuthModal("progress")}
                className="shrink-0 rounded-xl bg-berry px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-berry/90 transition-all active:scale-[0.99]"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Curated Health Library Section Header (Matches Stitch Screenshot 5) */}
        <div id="curated-library" className="mt-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
                <Sparkles size={12} />
                <span>EVIDENCE-BASED MODULES</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
                {searchQuery ? `Results for "${searchQuery}"` : "Curated Health Library"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {searchQuery 
                  ? "Scientifically validated modules matching your search inquiry." 
                  : "Explore culturally empathetic modules prepared in native tongues."}
              </p>
            </div>

            {/* Controls: Type Filter Tabs + Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/60">
                {TYPES.map(type => {
                  const isActive = typeFilter === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeFilter(type.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-white text-ink shadow-2xs"
                          : "text-slate-600 hover:text-ink"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition-all hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                >
                  <option value="recommended">Sort by: Recommended for you</option>
                  <option value="newest">Sort by: Most Recent</option>
                  <option value="duration">Sort by: Quick Reads</option>
                  <option value="az">Sort by: Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Feed Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60" />
            ))}
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-[#FCF8FA] text-center px-4 my-6">
            <p className="text-base font-semibold text-slate-700">
              No learning content found for this selection.
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {(languageFilter || user?.language) !== "en" 
                ? "Content might be in translation for this dialect. Try switching to English." 
                : "Try clearing filters to explore all topics."}
            </p>
            {isSearchingOrFiltering && (
              <Link
                href="/learn"
                className="mt-4 rounded-xl bg-[#3F1F36] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947]"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* 4-Column Card Grid matching Stitch Screenshot 5 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedData.map((item, index) => {
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
                
                // Inject an AdSlot after every 8 items (two full 4-card rows)
                if ((index + 1) % 8 === 0) {
                  return (
                    <div key={`wrapper-${item.id}`} className="contents">
                      {card}
                      <div className="col-span-full">
                        <AdSlot placementId="learn-feed-in-feed" className="w-full my-4" />
                      </div>
                    </div>
                  );
                }
                return card;
              })}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center pb-8">
                <button
                  onClick={() => fetchContent(page + 1, true)}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-2xl bg-[#3F1F36] px-7 py-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-[0.99] disabled:opacity-50"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Explore More Modules</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-berry" />
      </div>
    }>
      <LearnPageContent />
    </Suspense>
  );
}
