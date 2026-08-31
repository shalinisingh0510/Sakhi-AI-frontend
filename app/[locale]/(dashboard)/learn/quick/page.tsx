"use client";

import { useEffect, useState, useCallback } from "react";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { QuickLearnCard } from "@/components/learning/feed/QuickLearnCard";

export default function QuickLearnPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!token) return;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await learningApi.getFeed(token, {
        is_short_form: true,
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
    } catch (err) {
      console.error("Failed to fetch quick learn content", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContent(1, false);
  }, [fetchContent]);

  if (!token) {
    return <div className="text-center py-10">Please log in to view Quick Learn.</div>;
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-8 md:px-8">
      <Link 
        href="/learn" 
        className="flex w-fit items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to Learn Home
      </Link>

      <div className="mb-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-sm">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Quick Learn</h1>
            <p className="mt-1 text-slate-500">Fast, visual health education for when you&apos;re short on time.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="text-lg font-semibold text-slate-700">No quick learn content found.</p>
          <p className="mt-1 text-sm text-slate-500">Check back later for more short-form content.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.map((item) => (
              <QuickLearnCard key={item.id} content={item} href={`/learn/${item.id}`} />
            ))}
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
