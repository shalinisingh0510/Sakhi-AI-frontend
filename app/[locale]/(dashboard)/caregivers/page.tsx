"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { learningApi, type LearningContent, type Subtopic } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { 
  Loader2, 
  ChevronDown, 
  Sparkles, 
  Search, 
  HeartHandshake
} from "lucide-react";

import { CaregiverSidebar } from "@/components/caregiver/sidebar/CaregiverSidebar";
import { CaregiverMobileDrawer } from "@/components/caregiver/sidebar/CaregiverMobileDrawer";
import { CaregiverHero } from "@/components/caregiver/CaregiverHero";
import { AgeBandedRoadmap } from "@/components/caregiver/AgeBandedRoadmap";
import { ConversationScripts } from "@/components/caregiver/ConversationScripts";
import { CaregiverFaq } from "@/components/caregiver/CaregiverFaq";
import { DownloadableToolkits } from "@/components/caregiver/DownloadableToolkits";
import { AskSakhiSimulator } from "@/components/caregiver/AskSakhiSimulator";
import { CaregiverPledge } from "@/components/caregiver/CaregiverPledge";

import { LearningVideoCard } from "@/components/learning/feed/LearningVideoCard";
import { LearningArticleCard } from "@/components/learning/feed/LearningArticleCard";
import { LearningPostCard } from "@/components/learning/feed/LearningPostCard";

const TYPES = [
  { id: "", label: "All Formats" },
  { id: "ARTICLE", label: "Articles" },
  { id: "VIDEO", label: "Video Guides" },
  { id: "POST", label: "Infographics" },
];

function CaregiversPageContent() {
  const { token } = useAuthStore();

  // State
  const [data, setData] = useState<LearningContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  // Interactive filters
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("9-11");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("all");
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);

  // Fetch Caregiver topic subtopics for dynamic category filtering
  useEffect(() => {
    if (!token) return;
    learningApi.getTopicBySlug(token, "caregivers")
      .then((res) => {
        if (res?.subtopics) {
          setSubtopics(res.subtopics);
        }
      })
      .catch(() => {});
  }, [token]);

  // Fetch Caregiver Content Feed
  const fetchCaregiverContent = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await learningApi.getFeed(token, {
        category: "caregivers",
        type: typeFilter || undefined,
        search: searchQuery || undefined,
        subtopic_id: selectedSubtopic !== "all" ? selectedSubtopic : undefined,
        page: pageNum,
        limit: 24,
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

      setHasMore(res.items.length === (res.page_size || 24));
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch caregiver learning content", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, typeFilter, searchQuery, selectedSubtopic]);

  useEffect(() => {
    fetchCaregiverContent(1, false);
  }, [fetchCaregiverContent]);

  // Sorting
  const sortedData = useMemo(() => {
    const items = [...data];
    if (sortBy === "newest") {
      return items.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
    }
    if (sortBy === "duration") {
      return items.sort((a, b) => (a.duration_minutes || 5) - (b.duration_minutes || 5));
    }
    if (sortBy === "az") {
      return items.sort((a, b) => a.title.localeCompare(b.title));
    }
    return items;
  }, [data, sortBy]);

  return (
    <div className="mx-auto flex max-w-[1536px] gap-8 px-4 py-6 md:px-8">
      {/* Left Sidebar (Desktop) */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">
          <CaregiverSidebar 
            activeRole={selectedRole}
            onSelectRole={setSelectedRole}
            activeStage={selectedStage}
            onSelectStage={setSelectedStage}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <CaregiverMobileDrawer 
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        activeRole={selectedRole}
        onSelectRole={setSelectedRole}
        activeStage={selectedStage}
        onSelectStage={setSelectedStage}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* 1. Hero Section (Stitch Screen 2) */}
        <CaregiverHero 
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        {/* 2. Age-Banded Guidance Trackers (Stitch Screen 2 bottom) */}
        <AgeBandedRoadmap 
          activeStage={selectedStage}
          onSelectStage={setSelectedStage}
        />

        {/* 3. Verbatim Scripts & Practice (Stitch Screen 3 top) */}
        <ConversationScripts />

        {/* 4. Frequently Asked Caregiver Questions (Stitch Screen 4 top) */}
        <CaregiverFaq />

        {/* 5. Downloadable Toolkits & Audio Guidance (Stitch Screen 4 bottom) */}
        <DownloadableToolkits />

        {/* 6. Practice Real Responses with Ask Sakhi AI Simulator (Stitch Screen 5 top) */}
        <AskSakhiSimulator />

        {/* 7. Dedicated Caregiver Learning Library (Dynamic Database Grid) */}
        <div id="modules" className="mb-10">
          <div className="rounded-3xl border border-[#EDE2E7] bg-white p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
                  <Sparkles size={13} />
                  <span>EVIDENCE-BASED CAREGIVER MODULES</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
                  Curated Caregiver Learning Library
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                  Pediatrician-reviewed guides, video walkthroughs, and practical manuals for raising bodily confident young adults.
                </p>
              </div>

              {/* Format Filter Tabs & Sort */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/60">
                  {TYPES.map((type) => {
                    const isActive = typeFilter === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setTypeFilter(type.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-white text-ink shadow-2xs"
                            : "text-slate-600 hover:text-ink"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs outline-none transition-all hover:border-slate-300 focus:border-berry focus:ring-1 focus:ring-berry/20"
                  >
                    <option value="recommended">Sort by: Recommended</option>
                    <option value="newest">Sort by: Most Recent</option>
                    <option value="duration">Sort by: Quick Reads</option>
                    <option value="az">Sort by: Alphabetical (A-Z)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Filter Bar: Subtopic Select & Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search caregiver modules (e.g., father, pads, cramps, taboo)..."
                  className="w-full rounded-xl border border-slate-200 bg-[#FCFBFB] py-2.5 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-slate-400 focus:border-berry focus:bg-white focus:outline-none focus:ring-1 focus:ring-berry/20 transition-all"
                />
              </div>

              {/* Subtopic Filter Dropdown */}
              {subtopics.length > 0 && (
                <div className="relative w-full sm:w-auto shrink-0">
                  <select
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    className="w-full sm:w-auto appearance-none rounded-xl border border-slate-200 bg-[#FCFBFB] py-2.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-berry focus:bg-white focus:ring-1 focus:ring-berry/20"
                  >
                    <option value="all">All Caregiver Categories</option>
                    {subtopics.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              )}
            </div>

            {/* Dynamic Card Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60" />
                ))}
              </div>
            ) : sortedData.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[#FCF8FA] text-center px-4">
                <HeartHandshake className="h-8 w-8 text-berry/50 mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  No caregiver modules matched your filter.
                </p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Try clearing the search or category filters to explore all 8 caregiver modules.
                </p>
                {(searchQuery || typeFilter || selectedSubtopic !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setTypeFilter("");
                      setSelectedSubtopic("all");
                    }}
                    className="mt-3 rounded-xl bg-[#3F1F36] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#522947] transition-all"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedData.map((item) => {
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
                        return <LearningArticleCard key={item.id} content={item} href={href} />;
                    }
                  })}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => fetchCaregiverContent(page + 1, true)}
                      disabled={loadingMore}
                      className="flex items-center gap-2 rounded-2xl bg-[#3F1F36] px-6 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-98 disabled:opacity-50"
                    >
                      {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                      <span>Load More Caregiver Guides</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 8. Caregiver Pledge (Stitch Screen 1 bottom) */}
        <CaregiverPledge />
      </div>
    </div>
  );
}

export default function CaregiversPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-berry" />
        </div>
      }
    >
      <CaregiversPageContent />
    </Suspense>
  );
}
