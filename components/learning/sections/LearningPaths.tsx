"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learningApi, type LearningPath } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { BookOpen } from "lucide-react";
import { LearningPathCard } from "../feed/LearningPathCard";

interface LearningPathsProps {
  topicSlug?: string;
  limit?: number;
}

export function LearningPaths({ topicSlug, limit = 3 }: LearningPathsProps) {
  const { token } = useAuthStore();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // Fetch learning paths
    learningApi.getPaths(token, { topic_slug: topicSlug })
      .then((res) => {
        if (res.items) {
          setPaths(res.items.slice(0, limit));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, topicSlug, limit]);

  if (loading) {
    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-berry" size={24} />
            <h2 className="font-display text-xl font-bold text-ink">Learning Paths</h2>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-slate-100 sm:h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (paths.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-berry" size={24} />
          <h2 className="font-display text-2xl font-bold text-ink">
            {topicSlug ? "Topic Learning Paths" : "Guided Learning Paths"}
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {paths.map(path => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
