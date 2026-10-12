"use client";

import { Menu, Search, SlidersHorizontal, Loader2, Sparkles } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { authApi, learningApi, type Topic } from "@/lib/api";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";

interface LearnHeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
  description?: string;
}

const LANGUAGES = [
  { code: "en", label: "English", fullName: "english" },
  { code: "hi", label: "हिंदी", fullName: "hindi" },
  { code: "mr", label: "मराठी", fullName: "marathi" },
];

export function LearnHeader({ onOpenMobileNav, title, description }: LearnHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, token, updateUser } = useAuthStore();

  const isMainLearnPage = pathname === "/learn" || pathname.endsWith("/learn");

  // For Language Selector
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);
  const currentLangCode = searchParams?.get("language") || user?.language || "en";

  // For Search Debouncing
  const initialSearch = searchParams?.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Topics for quick filter pills
  const [topics, setTopics] = useState<Topic[]>([]);
  const currentTypeFilter = searchParams?.get("type") || "";

  useEffect(() => {
    setSearchTerm(searchParams?.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;
    learningApi.getTopics(token)
      .then((res) => setTopics(res.items.filter(t => t.is_active)))
      .catch(() => {});
  }, [token]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams?.get("search") || "")) {
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        params.delete("page");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const handleLanguageChange = async (newLang: string) => {
    if (newLang === currentLangCode || isUpdatingLang) return;
    setIsUpdatingLang(true);

    try {
      if (token) {
        const langObj = LANGUAGES.find(l => l.code === newLang);
        await authApi.updateProfile(token, { preferred_language: langObj?.fullName || "english" });
      }

      updateUser({ language: newLang as SupportedLanguage });

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("language", newLang);
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Failed to update language preference", error);
    } finally {
      setIsUpdatingLang(false);
    }
  };

  const handleTopicClick = (slug: string) => {
    if (!slug) {
      router.push("/learn");
    } else {
      router.push(`/learn/topics/${slug}`);
    }
  };

  const userName = user?.name ? user.name.split(" ")[0] : "Ananya";

  if (!isMainLearnPage && title) {
    // Topic detail header
    return (
      <div className="mb-8 rounded-3xl border border-blush/60 bg-gradient-to-br from-[#FFFDFD] via-[#FCF4F8] to-[#F8EBF2] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden rounded-xl p-2 text-ink/70 hover:bg-white hover:text-ink transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-berry/15 bg-berry/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-berry mb-2">
              <Sparkles size={12} />
              <span>Grounded Health Library</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink md:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-ink/70 md:text-base max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-[#EDE2E7] bg-gradient-to-br from-[#FDF8FA] via-[#FCF4F8] to-[#F7EBF2] p-6 sm:p-8 shadow-sm relative">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-lavender/30 blur-3xl" />

      {/* Top Bar: Kicker + Language Selector + Mobile Hamburger */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden rounded-xl p-1.5 text-ink/70 hover:bg-white/80 hover:text-ink transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-berry/15 bg-berry/10 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-berry">
            <Sparkles size={12} />
            <span>GROUNDED HEALTH SANCTUARY</span>
          </div>
        </div>

        {/* Language Pill Selector */}
        <div className="flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
          {LANGUAGES.map((lang) => {
            const isActive = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isUpdatingLang}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#3F1F36] text-white shadow-sm"
                    : "text-slate-600 hover:text-ink hover:bg-slate-100/70"
                } disabled:opacity-60`}
              >
                {lang.label}
              </button>
            );
          })}
          {isUpdatingLang && (
            <div className="px-1.5">
              <Loader2 size={13} className="animate-spin text-berry" />
            </div>
          )}
        </div>
      </div>

      {/* Main Greeting & Subtitle */}
      <div className="relative z-10 mt-5">
        <h1 className="font-display text-2xl sm:text-3xl md:text-[34px] font-bold text-ink leading-tight tracking-tight">
          Welcome back, {userName}! What would you like to explore today?
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink/70 max-w-2xl leading-relaxed">
          Scientifically vetted, culturally considerate guidance crafted to support your rhythm with gentleness and clarity.
        </p>
      </div>

      {/* Search Bar + Filter Button */}
      <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics (e.g. cramps, iron-rich diet, menstrual cup, PCOS symptoms)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/90 bg-white/95 py-3.5 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-berry focus:bg-white focus:ring-2 focus:ring-berry/20"
          />
        </div>

        <button
          onClick={() => {
            const element = document.getElementById("curated-library");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3F1F36] px-5 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-[0.99] shrink-0"
        >
          <SlidersHorizontal size={15} />
          <span>Filter Library</span>
        </button>
      </div>

      {/* Topic Quick Filter Pills */}
      <div className="relative z-10 mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleTopicClick("")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            pathname === "/learn" && !currentTypeFilter
              ? "bg-[#3F1F36] text-white shadow-sm"
              : "bg-white/80 text-slate-700 border border-slate-200/80 hover:bg-white"
          }`}
        >
          All Topics ({topics.length || 8})
        </button>
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTopicClick(t.slug)}
            className="shrink-0 rounded-full bg-white/80 border border-slate-200/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-white hover:border-slate-300 flex items-center gap-1.5 shadow-2xs"
          >
            {t.icon && <span className="text-xs">{t.icon}</span>}
            <span>{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
