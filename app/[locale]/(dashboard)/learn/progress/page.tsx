"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { learnApi, type LearningContent } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, Flame, Trophy, PlayCircle, BookOpen, Bookmark, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";

interface LearningStats {
  videos_watched: number;
  articles_read: number;
  learning_minutes: number;
  completed_lessons: number;
  streak?: { current: number; longest: number };
  continue_learning?: { id: string; title: string; category: string; content_type: string; thumbnail_url?: string };
  badges?: { key: string; earned_at: string }[];
}

interface HistoryItem {
  content: LearningContent;
  progress: {
    completed: boolean;
    progress_percent: number;
    last_accessed_at: string;
  };
}

export default function ProgressCenterPage() {
  const { token } = useAuthStore();
  
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    Promise.allSettled([
      learnApi.getLearningSummary(token),
      learnApi.getLearningHistory(token),
      learnApi.getLearningBookmarks(token),
    ]).then(([summaryRes, historyRes, bookmarksRes]) => {
      if (summaryRes.status === "fulfilled") setStats(summaryRes.value as LearningStats);
      if (historyRes.status === "fulfilled") setHistory((historyRes.value as { items: HistoryItem[] }).items || []);
      if (bookmarksRes.status === "fulfilled") setBookmarks((bookmarksRes.value as { items: LearningContent[] }).items || []);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-berry" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1 text-sm text-berry hover:underline">
        ← Back to Learn
      </Link>
      
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">My Learning Progress</h1>
          <p className="mt-2 text-ink/70">Track your knowledge journey and saved content.</p>
        </div>
        
        {(stats.streak?.current ?? 0) > 0 && stats.streak && (
          <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-600">
            <Flame size={20} className="fill-orange-500" />
            <div>
              <div className="font-bold">{stats.streak.current} Day Streak</div>
              {stats.streak.longest > stats.streak.current && (
                <div className="text-[10px] uppercase font-bold text-orange-500/80">Best: {stats.streak.longest} Days</div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* OVERVIEW STATS */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl mb-1 text-berry flex justify-center"><PlayCircle /></p>
          <p className="font-display text-2xl font-bold text-ink">{stats.videos_watched}</p>
          <p className="text-xs text-ink/60">Videos Watched</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl mb-1 text-berry flex justify-center"><BookOpen /></p>
          <p className="font-display text-2xl font-bold text-ink">{stats.articles_read}</p>
          <p className="text-xs text-ink/60">Articles Read</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl mb-1 text-berry flex justify-center"><Clock /></p>
          <p className="font-display text-2xl font-bold text-ink">{stats.learning_minutes}</p>
          <p className="text-xs text-ink/60">Learning Minutes</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl mb-1 text-berry flex justify-center"><Trophy /></p>
          <p className="font-display text-2xl font-bold text-ink">{stats.completed_lessons}</p>
          <p className="text-xs text-ink/60">Completed Lessons</p>
        </Card>
      </div>

      {/* CONTINUE LEARNING */}
      {stats.continue_learning && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-ink">Continue Learning</h2>
          <Link href={`/learn/${stats.continue_learning.id}`} className="group block">
            <Card padding="md" className="flex items-center justify-between border-berry/20 bg-berry/5 hover:bg-berry/10 transition-colors">
              <div className="flex items-center gap-4">
                {stats.continue_learning.thumbnail_url ? (
                  <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stats.continue_learning.thumbnail_url} className="w-full h-full object-cover" alt="" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center text-berry shrink-0">
                    {stats.continue_learning.content_type === "VIDEO" ? <PlayCircle /> : <BookOpen />}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-ink group-hover:text-berry transition-colors">{stats.continue_learning.title}</h3>
                  <p className="text-sm text-ink/60">{stats.continue_learning.category}</p>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-berry shadow-sm group-hover:bg-berry group-hover:text-white transition-colors">
                <ArrowRight size={20} />
              </div>
            </Card>
          </Link>
        </section>
      )}

      {Array.isArray(stats.badges) && stats.badges.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-ink">Unlocked Badges</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.badges.map((b) => (
              <Card key={b.key} padding="sm" className="flex flex-col items-center text-center">
                <div className="mb-2 h-12 w-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-sm">
                  <Trophy size={24} className="text-white" />
                </div>
                <p className="text-sm font-bold text-ink">{b.key.replace("_", " ")}</p>
                <p className="text-[10px] text-ink/50 uppercase">{new Date(b.earned_at).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEARNING HISTORY */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="text-berry" size={20} />
            <h2 className="text-lg font-bold text-ink">Learning History</h2>
          </div>
          
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => {
                const content = item.content;
                const progress = item.progress;
                return (
                <div key={content.id} className="flex gap-4 items-start border-b border-slate-100 pb-4">
                  {content.thumbnail_url ? (
                    <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={content.thumbnail_url} className="w-full h-full object-cover" alt="" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                      {content.content_type === "VIDEO" ? <PlayCircle /> : <BookOpen />}
                    </div>
                  )}
                  <div className="flex-1">
                    <Link href={`/learn/${content.id}`} className="font-bold text-ink hover:text-berry text-sm line-clamp-2">
                      {content.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-ink/60">
                      {progress.completed ? (
                        <span className="text-moss font-semibold">Completed</span>
                      ) : (
                        <span>{progress.progress_percent}% {content.content_type === 'VIDEO' ? 'watched' : 'read'}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(progress.last_accessed_at as string).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <Card padding="md" className="text-center text-ink/60 bg-slate-50">
              No learning history yet.
            </Card>
          )}
        </section>

        {/* SAVED LEARNING */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Bookmark className="text-berry" size={20} />
            <h2 className="text-lg font-bold text-ink">Saved Learning</h2>
          </div>
          
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookmarks.map((content) => {
                if (content.content_type === "VIDEO") {
                  return <LearningVideoCard key={content.id} content={content} href={`/learn/${content.id}`} />;
                }
                if (content.content_type === "POST") {
                  return <LearningPostCard key={content.id} content={content} href={`/learn/${content.id}`} />;
                }
                return <LearningArticleCard key={content.id} content={content} href={`/learn/${content.id}`} />;
              })}
            </div>
          ) : (
            <Card padding="md" className="text-center text-ink/60 bg-slate-50">
              No saved learning yet. Save videos, articles, and posts you want to come back to later.
            </Card>
          )}
        </section>
      </div>

    </div>
  );
}
