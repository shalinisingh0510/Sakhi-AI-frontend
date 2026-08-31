"use client";

import { useEffect, useState } from "react";
import { learningApi, type RecommendationResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Sparkles } from "lucide-react";
import { LearningVideoCard } from "../feed/LearningVideoCard";
import { LearningArticleCard } from "../feed/LearningArticleCard";
import { LearningPostCard } from "../feed/LearningPostCard";

export function RecommendedContent() {
  const { token } = useAuthStore();
  const [items, setItems] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // Phase 7: Fetch personalized recommendations
    learningApi.getRecommendations(token, 4)
      .then((res) => {
        if (res.items) {
          setItems(res.items);
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
        {items.map(rec => {
          const item = rec.content;
          const href = `/learn/${item.id}`;
          return (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="text-xs font-medium text-berry">{rec.reason}</div>
              {item.content_type === "VIDEO" || item.content_type === "TUTORIAL" ? (
                <LearningVideoCard content={item} href={href} />
              ) : item.content_type === "ARTICLE" ? (
                <LearningArticleCard content={item} href={href} />
              ) : (
                <LearningPostCard content={item} href={href} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
