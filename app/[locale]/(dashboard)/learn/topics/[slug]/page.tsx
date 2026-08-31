"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { learningApi, type LearningContent, type Topic } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { LearnSidebar } from "@/components/learning/sidebar/LearnSidebar";
import { LearnMobileDrawer } from "@/components/learning/sidebar/LearnMobileDrawer";
import { LearnHeader } from "@/components/learning/LearnHeader";
import { LearnRightRail } from "@/components/learning/LearnRightRail";

import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";
import { LearningPaths } from "@/components/learning/sections/LearningPaths";

const TYPES = [
  { id: "", label: "All Content" },
  { id: "VIDEO", label: "Videos" },
  { id: "ARTICLE", label: "Articles" },
  { id: "POST", label: "Posts" }
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
      
      setHasMore(res.items.length === (res.page_size || 20));
      setPage(pageNum);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch learning content", err);
      // We don't set error here if it's just an empty page, only if fetch fails entirely
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
    router.push(`${pathname}?${current.toString()}`);
  };

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
        <LearnHeader 
          onOpenMobileNav={() => setMobileNavOpen(true)} 
          title={topic ? `${topic.icon || ""} ${topic.name}` : "Loading..."}
          description={topic?.description || ""}
        />
        
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/learn" className="hover:text-ink transition-colors">
            Learn
          </Link>
          <span>/</span>
          <span className="text-ink">{topic?.name || "..."}</span>
        </div>

        {topic && topic.subtopics.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink/40">Subtopics</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilters("subtopic", "")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  !subtopicSlug
                    ? "bg-berry/10 text-berry"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All {topic.name}
              </button>
              {topic.subtopics.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => updateFilters("subtopic", sub.slug)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    subtopicSlug === sub.slug
                      ? "bg-berry/10 text-berry"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Learning Paths specific to this topic */}
        <LearningPaths topicSlug={slug} />

        {/* Language filter & Topic Subtopics */}
        <div className="mb-8 space-y-6 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap gap-2">
            {TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => updateFilters("type", type.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === type.id || (type.id === "" && !typeFilter)
                    ? "bg-ink text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Area */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-berry/50" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center px-4">
            <p className="text-lg font-semibold text-slate-700">No learning content found.</p>
            <p className="mt-1 text-sm text-slate-500">
              {(languageFilter || user?.language) !== "en" 
                ? "There might not be content available in your selected language yet. Try switching to English." 
                : "Try a different subtopic or filter."}
            </p>
            {(subtopicSlug || typeFilter || languageFilter) && (
              <button
                onClick={() => {
                  router.push(`/learn/topics/${slug}`);
                }}
                className="mt-4 text-sm font-semibold text-berry hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {data.map((item) => {
                const href = `/learn/${item.id}`;
                switch (item.content_type) {
                  case "VIDEO":
                  case "TUTORIAL":
                    return <LearningVideoCard key={item.id} content={item} href={href} />;
                  case "ARTICLE":
                    return <LearningArticleCard key={item.id} content={item} href={href} />;
                  case "POST":
                    return <LearningPostCard key={item.id} content={item} href={href} />;
                  default:
                    return null;
                }
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
