"use client";

import { Menu, Search, Globe } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface LearnHeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
  description?: string;
}

export function LearnHeader({ onOpenMobileNav, title = "Learn 🌸", description = "Learn something new about your health today." }: LearnHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLang = searchParams?.get("language") || "en";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We would typically navigate to search page or update local state
    // For now, this mimics the existing search functionality on the learn page
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (e.target.value === "en") {
      params.delete("language");
    } else {
      params.set("language", e.target.value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
            placeholder="Search topics..."
            defaultValue={searchParams?.get("search") || ""}
            onChange={handleSearch}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-berry/50 focus:ring-1 focus:ring-berry/50"
          />
        </div>
        
        <div className="relative">
          <select
            value={currentLang}
            onChange={handleLanguageChange}
            className="h-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-medium outline-none transition-colors focus:border-berry/50 focus:ring-1 focus:ring-berry/50"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
