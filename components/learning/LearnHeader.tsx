"use client";

import { Menu, Search, Globe, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

interface LearnHeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
  description?: string;
}

export function LearnHeader({ onOpenMobileNav, title = "Learn 🌸", description = "Learn something new about your health today." }: LearnHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, token, updateUser } = useAuthStore();
  
  // For Language Selector
  const [isUpdatingLang, setIsUpdatingLang] = useState(false);
  const currentLangCode = searchParams?.get("language") || user?.language || "en";

  // For Search Debouncing
  const initialSearch = searchParams?.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Map our UI ISO codes to backend full strings if needed by auth update
  const langMapToFull: Record<string, string> = {
    en: "english",
    hi: "hindi",
    mr: "marathi",
  };

  useEffect(() => {
    setSearchTerm(searchParams?.get("search") || "");
  }, [searchParams]);

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
        params.delete("page"); // Reset pagination on new search
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "en" | "hi" | "mr";
    
    // Update local state temporarily to feel responsive
    setIsUpdatingLang(true);

    try {
      // 1. Update user profile backend
      if (token) {
        const fullLangName = langMapToFull[newLang] || "english";
        await authApi.updateProfile(token, { preferred_language: fullLangName });
      }

      // 2. Update local store
      updateUser({ language: newLang });

      // 3. Update URL if we are overriding or just refresh the data
      // For a clean URL, we typically delete the language param if it's matching user preference,
      // but explicitly setting it ensures the query re-runs immediately.
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("language"); // Let the backend use the newly saved default
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      
    } catch (error) {
      console.error("Failed to update language preference", error);
    } finally {
      setIsUpdatingLang(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden rounded-lg p-2 text-ink/70 hover:bg-slate-100 hover:text-ink focus:outline-none"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-ink/70 md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex w-full gap-3 md:w-auto">
        <div className="relative flex-1 md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-berry/50 focus:ring-1 focus:ring-berry/50"
          />
        </div>
        
        <div className="relative">
          <select
            value={currentLangCode}
            onChange={handleLanguageChange}
            disabled={isUpdatingLang}
            className="h-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-medium outline-none transition-colors focus:border-berry/50 focus:ring-1 focus:ring-berry/50 disabled:opacity-50"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
          {isUpdatingLang ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-berry" />
          ) : (
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
