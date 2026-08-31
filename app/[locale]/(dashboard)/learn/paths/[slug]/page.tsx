/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { learningApi, type LearningPath, type LearningPathProgressResponse } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, BookOpen, Clock, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LearningPathPage() {
  const { token } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  
  const slug = typeof params.slug === "string" ? params.slug : "";
  
  const [path, setPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<LearningPathProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !slug) return;
    
    setLoading(true);
    // Fetch path and its progress
    learningApi.getPath(token, slug)
      .then((pathData) => {
        setPath(pathData);
        return learningApi.getPathProgress(token, pathData.id);
      })
      .then((progressData) => {
        setProgress(progressData);
      })
      .catch((err) => {
        console.error("Failed to fetch path", err);
        setError("Learning Path not found");
      })
      .finally(() => setLoading(false));
  }, [token, slug]);

  const handleStartContinue = () => {
    if (!path) return;
    
    // Find first unfinished item
    let targetContentId = null;
    
    for (const mod of path.modules) {
      for (const item of mod.items) {
        // Since we don't have item-level completion details in the aggregate endpoint,
        // ideally we would hit another endpoint, but for now we'll route to the first one
        // and let the Content Viewer handle progress logic, or route to the first overall item.
        // A smarter logic here would be to fetch detailed history and find the first incomplete.
        // We will just default to the very first item for "Start", and for "Continue" we 
        // really need the API to tell us "next item".
        // Here we just go to the first item for demonstration.
        targetContentId = item.content_id;
        break;
      }
      if (targetContentId) break;
    }
    
    if (targetContentId) {
      router.push(`/learn/${targetContentId}`);
    }
  };

  if (!token) {
    return <div className="text-center py-10">Please log in to view learning paths.</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-berry/50" />
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-ink">{error || "Not found"}</h1>
        <Link href="/learn" className="mt-4 text-berry hover:underline">
          Return to Learn Home
        </Link>
      </div>
    );
  }

  const isCompleted = progress?.progress_percent === 100;
  const isStarted = progress && progress.progress_percent > 0;

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 px-4 py-8 md:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/learn" className="hover:text-ink transition-colors">
          Learn
        </Link>
        <span>/</span>
        <span className="text-ink">Path: {path.title}</span>
      </div>

      {/* Hero Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-video w-full bg-slate-100 sm:aspect-[21/9]">
          {path.thumbnail_url ? (
            <img src={path.thumbnail_url} alt={path.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-berry/20 to-purple-500/20">
              <BookOpen className="text-berry/40" size={64} />
            </div>
          )}
        </div>
        
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-berry/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-berry">
              Learning Path
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <Clock size={16} /> Self-paced
            </span>
          </div>
          
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{path.title}</h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{path.description}</p>
          
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-6 border border-slate-100">
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Your Progress</h3>
              <div className="flex items-center gap-4">
                <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                  <div 
                    className="h-full bg-berry transition-all duration-1000" 
                    style={{ width: `${progress?.progress_percent || 0}%` }} 
                  />
                </div>
                <span className="font-bold text-ink">{progress?.progress_percent || 0}%</span>
              </div>
            </div>
            
            <button 
              onClick={handleStartContinue}
              className="w-full sm:w-auto rounded-xl bg-berry px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-berry/90 hover:shadow-md"
            >
              {isCompleted ? "Review Path" : isStarted ? "Continue Learning" : "Start Learning"}
            </button>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="mt-4 space-y-6">
        <h2 className="font-display text-2xl font-bold text-ink">Modules in this Path</h2>
        
        <div className="space-y-4">
          {path.modules.map((mod, index) => {
            const modProgress = progress?.module_progress?.[mod.id];
            const modCompleted = modProgress?.completed === modProgress?.total && (modProgress?.total ?? 0) > 0;
            
            return (
              <div key={mod.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      <span className="text-berry/50 mr-2">Module {index + 1}:</span>
                      {mod.title}
                    </h3>
                    {mod.description && <p className="mt-2 text-slate-600">{mod.description}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                    {modProgress?.completed || 0} / {modProgress?.total || mod.items.length} completed
                  </div>
                </div>
                
                <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                  {mod.items.map((item, itemIdx) => (
                    <Link 
                      key={item.id} 
                      href={`/learn/${item.content_id}`}
                      className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        {/* We don't have item-level completion here yet, so we assume checkmark if the whole module is done, else circle. In reality, you'd calculate this from history. */}
                        {modCompleted ? (
                          <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                        ) : (
                          <Circle className="text-slate-300 shrink-0" size={20} />
                        )}
                        <span className="font-medium text-slate-700 group-hover:text-berry transition-colors line-clamp-1">
                          {itemIdx + 1}. {item.content.title}
                        </span>
                      </div>
                      <ChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-berry" size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
