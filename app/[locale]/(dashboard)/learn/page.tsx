"use client";


import { useEffect, useState, useCallback } from "react";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, Search } from "lucide-react";
import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";
import { LearningProgressCard } from "@/components/learning/LearningProgressCard";

const CATEGORIES = [
  { id: "", label: "All Topics" },
  { id: "menstrual-health", label: "Periods" },
  { id: "mental-wellbeing", label: "Mental Health" },
  { id: "nutrition-health", label: "Nutrition" },
  { id: "puberty-basics", label: "Puberty" },
  { id: "personal-hygiene", label: "Hygiene" },
  { id: "safety-consent", label: "Safety" }
];

const TYPES = [
  { id: "", label: "All" },
  { id: "VIDEO", label: "Videos" },
  { id: "ARTICLE", label: "Articles" },
  { id: "POST", label: "Posts" }
];

export default function LearnPage() {

  const { token } = useAuthStore();
  
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Debounced
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!token) return;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await learningApi.getFeed(token, {
        category: categoryFilter,
        type: typeFilter,
        search: searchQuery,
        page: pageNum
      });
      
      if (isLoadMore) {
        setData(prev => [...prev, ...res.items]);
      } else {
        setData(res.items);
      }
      
      // If we got fewer items than a standard page size (e.g. 20), we don't have more.
      // Or we can rely on total from backend if returned.
      setHasMore(res.items.length === (res.page_size || 20));
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch learning content", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, categoryFilter, typeFilter, searchQuery]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Refetch when filters or search changes
  useEffect(() => {
    fetchContent(1, false);
  }, [fetchContent]);

  if (!token) {
    return <div className="text-center py-10">Please log in to view learning modules.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      
      {/* Header Area */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
            Learn <span className="text-berry">🌸</span>
          </h1>
          <p className="mt-2 text-ink/70">
            Learn something new about your health today.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-berry/50 focus:ring-1 focus:ring-berry/50"
          />
        </div>
      </div>
      
      <LearningProgressCard />

      {/* Filters Area */}
      <div className="mb-8 space-y-4">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                typeFilter === type.id
                  ? "bg-ink text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {/* Category Filters - Scrollable Row on Mobile */}
        <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat.id
                  ? "border-berry bg-berry/10 text-berry"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat.label}
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
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="text-lg font-semibold text-slate-700">No learning content found.</p>
          <p className="mt-1 text-sm text-slate-500">Try another topic or search term.</p>
          {(search || typeFilter || categoryFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setCategoryFilter("");
              }}
              className="mt-4 text-sm font-semibold text-berry hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => {
              const href = `/learn/${item.id}`;
              switch (item.content_type) {
                case "VIDEO":
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
  );
}
