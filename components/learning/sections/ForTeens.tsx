"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Sparkle } from "lucide-react";
import { LearningVideoCard } from "../feed/LearningVideoCard";
import { LearningArticleCard } from "../feed/LearningArticleCard";
import { LearningPostCard } from "../feed/LearningPostCard";

export function ForTeens() {
  const { token, user } = useAuthStore();
  const [items, setItems] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  const isTeen = user?.ageGroup === "10-13" || user?.ageGroup === "14-18";

  useEffect(() => {
    if (!token || !isTeen) {
      setLoading(false);
      return;
    }
    
    // Fetch teen-specific content
    learningApi.getFeed(token, { audience: "TEEN" })
      .then((res) => {
        if (res.items) {
          // Take top 4 items for recommendations
          setItems(res.items.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, isTeen]);

  if (!isTeen) return null;

  if (loading) {
    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkle className="text-purple-500" size={20} />
          <h2 className="font-display text-xl font-bold text-ink">For Teens</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-purple-50" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-10 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 border border-purple-100">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="text-purple-500" size={24} />
          <h2 className="font-display text-2xl font-bold text-purple-900">For Teens</h2>
        </div>
        <Link 
          href="/learn?audience=TEEN" 
          className="text-sm font-semibold text-purple-700 transition-colors hover:text-purple-900"
        >
          View All
        </Link>
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
