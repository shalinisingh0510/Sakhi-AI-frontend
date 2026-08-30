"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Sparkles } from "lucide-react";
import { LearningVideoCard } from "../feed/LearningVideoCard";
import { LearningArticleCard } from "../feed/LearningArticleCard";
import { LearningPostCard } from "../feed/LearningPostCard";

export function RecommendedContent() {
  const { token } = useAuthStore();
  const [items, setItems] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // In the future this would be a dedicated recommendation endpoint.
    // For now, we fetch a few non-featured items that have high ranking or recent dates.
    learningApi.getFeed(token, { is_featured: false })
      .then((res) => {
        if (res.items) {
          // Take top 4 items for recommendations
          setItems(res.items.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-berry" size={20} />
          <h2 className="font-display text-xl font-bold text-ink">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="text-berry" size={20} />
        <h2 className="font-display text-xl font-bold text-ink">Recommended for You</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {items.map(item => {
          const href = `/learn/${item.id}`;
          if (item.content_type === "VIDEO" || item.content_type === "TUTORIAL") {
            return <LearningVideoCard key={item.id} content={item} href={href} />;
          }
          if (item.content_type === "ARTICLE") {
            return <LearningArticleCard key={item.id} content={item} href={href} />;
          }
          if (item.content_type === "POST") {
            return <LearningPostCard key={item.id} content={item} href={href} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
