"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { learningApi, type LearningContent, type Topic } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

import { LearnSidebar } from "@/components/learning/sidebar/LearnSidebar";
import { LearnMobileDrawer } from "@/components/learning/sidebar/LearnMobileDrawer";
import { LearnHeader } from "@/components/learning/LearnHeader";
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

export default function TopicPage() {
  const { token, user } = useAuthStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const slug = typeof params.slug === "string" ? params.slug : "";
  const subtopicSlug = searchParams?.get("subtopic") || "";
  const typeFilter = searchParams?.get("type") || "";
  const languageFilter = searchParams?.get("language") || "";
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Fetch topic details
  useEffect(() => {
    if (!token || !slug) return;
    
    learningApi.getTopicBySlug(token, slug)
      .then(setTopic)
      .catch((err) => {
        console.error("Failed to fetch topic", err);
        setError("Topic not found");
      });
  }, [token, slug]);

  const fetchContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!token || !slug) return;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await learningApi.getTopicContent(token, slug, {
        subtopic: subtopicSlug,
        content_type: typeFilter,
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
      setError(null);
    } catch (err) {
      console.error("Failed to fetch learning content", err);
      if (!isLoadMore) {
        setData([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, slug, subtopicSlug, typeFilter, languageFilter]);

  // Refetch when filters change
  useEffect(() => {
    fetchContent(1, false);
  }, [fetchContent]);

  const updateFilters = (key: string, value: string) => {
    const current = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    // Reset page on filter change
    current.delete("page");
    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
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

  if (!token) {
    return <div className="text-center py-10">Please log in to view learning modules.</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-ink">{error}</h1>
        <Link href="/learn" className="mt-4 text-berry hover:underline">
          Return to Learn Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1536px] gap-8 px-4 py-6 md:px-8">
      {/* Left Sidebar (Desktop) - Untouched and professional */}
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

      {/* Main Content Area - Full width for 4-column cards */}
      <div className="flex-1 min-w-0">
        {/* Grounded Health Sanctuary Hero Banner */}
        <LearnHeader 
          onOpenMobileNav={() => setMobileNavOpen(true)} 
          title={topic ? `${topic.icon ? topic.icon + " " : ""}${topic.name}` : undefined}
          description={topic?.description || ""}
        />
        
        {/* Breadcrumbs */}
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/learn" className="hover:text-berry transition-colors">
            Learn Home
          </Link>
          <span>/</span>
          <span className="text-ink font-bold">{topic?.name || slug}</span>
          {subtopicSlug && (
            <>
              <span>/</span>
              <span className="text-berry font-bold capitalize">
                {subtopicSlug.replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>

        {/* Subtopics Pill Row matching Stitch */}
        {topic && topic.subtopics.length > 0 && (
          <div className="mb-8 rounded-2xl border border-[#EDE2E7] bg-white/70 p-4 shadow-2xs backdrop-blur-sm">
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Subtopics in {topic.name}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateFilters("subtopic", "")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  !subtopicSlug
                    ? "bg-[#3F1F36] text-white shadow-sm"
                    : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                All {topic.name}
              </button>
              {topic.subtopics.map(sub => {
                const isActive = subtopicSlug === sub.slug;
                return (
                  <button
                    key={sub.id}
                    onClick={() => updateFilters("subtopic", sub.slug)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#3F1F36] text-white font-semibold shadow-sm"
                        : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Paths specific to this topic */}
        <LearningPaths topicSlug={slug} limit={2} />

        {/* Curated Health Library Section Header (Matches Stitch Screenshot 5) */}
        <div id="curated-library" className="mt-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
                <Sparkles size={12} />
                <span>EVIDENCE-BASED MODULES</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
                {subtopicSlug 
                  ? `${subtopicSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Modules`
                  : topic 
                    ? `Curated ${topic.name} Library` 
                    : "Curated Health Library"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Explore culturally empathetic modules prepared in native tongues.
              </p>
            </div>

            {/* Controls: Type Filter Tabs + Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/60">
                {TYPES.map(type => {
                  const isActive = (typeFilter === type.id) || (type.id === "" && !typeFilter);
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateFilters("type", type.id)}
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

        {/* 4-Column Card Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60" />
            ))}
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-[#FCF8FA] text-center px-4 my-6">
            <p className="text-base font-semibold text-slate-700">No learning content found for this selection.</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {(languageFilter || user?.language) !== "en" 
                ? "There might not be content available in your selected language yet. Try switching to English." 
                : "Try a different subtopic or clearing filters."}
            </p>
            {(subtopicSlug || typeFilter || languageFilter) && (
              <button
                onClick={() => {
                  router.push(`/learn/topics/${slug}`);
                }}
                className="mt-4 rounded-xl bg-[#3F1F36] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947]"
              >
                Clear all filters
              </button>
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

                if ((index + 1) % 8 === 0) {
                  return (
                    <div key={`wrapper-${item.id}`} className="contents">
                      {card}
                      <div className="col-span-full">
                        <AdSlot placementId="learn-topic-in-feed" className="w-full my-4" />
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
