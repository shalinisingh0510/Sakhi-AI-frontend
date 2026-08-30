"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Zap } from "lucide-react";
import { QuickLearnCard } from "../feed/QuickLearnCard";

export function QuickLearn() {
  const { token } = useAuthStore();
  const [items, setItems] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // Fetch quick, easily digestible posts for this section
    learningApi.getFeed(token, { is_short_form: true })
      .then((res) => {
        if (res.items) {
          setItems(res.items.slice(0, 6)); // Take up to 6 items
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-orange-500" size={20} />
            <h2 className="font-display text-xl font-bold text-ink">Quick Learn</h2>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden pb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 w-64 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-orange-500" size={20} />
          <h2 className="font-display text-xl font-bold text-ink">Quick Learn</h2>
        </div>
        <Link 
          href="/learn/quick" 
          className="text-sm font-semibold text-berry transition-colors hover:text-berry/80"
        >
          See All
        </Link>
      </div>
      
      {/* Horizontally scrollable container */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map(item => (
          <div key={item.id} className="w-[180px] sm:w-[220px] shrink-0 snap-start">
            <QuickLearnCard content={item} href={`/learn/${item.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
