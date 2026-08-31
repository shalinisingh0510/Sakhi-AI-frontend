"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { learningApi, type Topic } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { ChevronDown, ChevronRight, Bookmark, BarChart2, Home } from "lucide-react";

interface LearnSidebarProps {
  className?: string;
}

export function LearnSidebar({ className = "" }: LearnSidebarProps) {
  const { token } = useAuthStore();
  const pathname = usePathname();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) return;
    learningApi.getTopics(token)
      .then((res) => setTopics(res.items))
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Auto-expand the active topic
  useEffect(() => {
    const match = pathname.match(/\/learn\/topics\/([^/]+)/);
    if (match) {
      setExpandedTopics((prev) => new Set([...prev, match[1]]));
    }
  }, [pathname]);

  const toggleTopic = (slug: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const isTopicActive = (slug: string) => pathname.includes(`/learn/topics/${slug}`);

  const navItems = [
    { href: "/learn", label: "For You", icon: Home },
    { href: "/learn/progress", label: "My Progress", icon: BarChart2 },
    { href: "/learn/bookmarks", label: "Saved", icon: Bookmark },
  ];

  return (
    <aside
      className={`flex flex-col gap-1 ${className}`}
      aria-label="Learn navigation"
    >
      {/* Quick nav */}
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-ink/40">
        LEARN
      </p>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/learn" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-berry/10 text-berry"
                : "text-ink/70 hover:bg-slate-100 hover:text-ink",
            ].join(" ")}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      {/* Topics */}
      <div className="mt-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-ink/40">
          TOPICS
        </p>

        {loading ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="px-3 text-sm text-ink/40">No topics available</p>
        ) : (
          <div className="space-y-0.5">
            {topics.map((topic) => {
              const isExpanded = expandedTopics.has(topic.slug);
              const isActive = isTopicActive(topic.slug);
              const hasSubtopics = topic.subtopics.length > 0;

              return (
                <div key={topic.id}>
                  {/* Topic row */}
                  <div className="flex items-center">
                    <Link
                      href={`/learn/topics/${topic.slug}`}
                      className={[
                        "flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-berry/10 text-berry"
                          : "text-ink/70 hover:bg-slate-100 hover:text-ink",
                      ].join(" ")}
                    >
                      <span className="text-base" aria-hidden="true">
                        {topic.icon}
                      </span>
                      <span className="flex-1 truncate">{topic.name}</span>
                    </Link>
                    {hasSubtopics && (
                      <button
                        onClick={() => toggleTopic(topic.slug)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${topic.name} subtopics`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 hover:bg-slate-100 hover:text-ink"
                      >
                        {isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subtopics */}
                  {isExpanded && hasSubtopics && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-2">
                      {topic.subtopics.map((sub) => {
                        const subActive = pathname.includes(
                          `/learn/topics/${topic.slug}?subtopic=${sub.slug}`
                        );
                        return (
                          <Link
                            key={sub.id}
                            href={`/learn/topics/${topic.slug}?subtopic=${sub.slug}`}
                            className={[
                              "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                              subActive
                                ? "bg-berry/10 font-semibold text-berry"
                                : "text-ink/60 hover:bg-slate-100 hover:text-ink",
                            ].join(" ")}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
