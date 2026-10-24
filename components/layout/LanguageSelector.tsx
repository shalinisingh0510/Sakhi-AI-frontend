"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe, Check, ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n-config";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { authApi } from "@/lib/api";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  flagEmoji: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English", flagEmoji: "🌐" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flagEmoji: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flagEmoji: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flagEmoji: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flagEmoji: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flagEmoji: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flagEmoji: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flagEmoji: "🇮🇳" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flagEmoji: "🇮🇳" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", flagEmoji: "🇮🇳" },
];

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSelector({ className = "", compact = false }: LanguageSelectorProps) {
  const currentLocale = useLocale() as SupportedLanguage;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { token, user, updateUser } = useAuthStore();

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLocale) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = async (newLocale: SupportedLanguage) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    // 1. Set cookie for next-intl & server middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Update client auth state
    updateUser({ language: newLocale });

    // 3. Persist to backend user profile if signed in
    if (token) {
      authApi.updateProfile(token, { preferred_language: newLocale }).catch(() => {
        // fail-soft
      });
    }

    // 4. Calculate target URL with preserved path and search params
    const segments = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = locales.includes(segments[0] as Locale);
    const cleanSegments = hasLocalePrefix ? segments.slice(1) : segments;
    const cleanPath = cleanSegments.length > 0 ? `/${cleanSegments.join("/")}` : "";

    let targetPath = "";
    if (newLocale === "en") {
      targetPath = cleanPath || "/";
    } else {
      targetPath = `/${newLocale}${cleanPath}`;
    }

    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const targetUrl = `${targetPath}${currentSearch}`;

    // Reload with new URL to mount localized server dictionary
    window.location.href = targetUrl;
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "flex items-center gap-1.5 rounded-full border border-peach/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink/80 shadow-2xs hover:bg-peach/30 hover:border-berry/30 hover:text-ink transition-all active:scale-95",
          compact ? "px-2 py-1 text-[11px]" : "",
        ].join(" ")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select Language / भाषा चुनें"
      >
        <Globe className="h-3.5 w-3.5 text-berry" />
        <span className="font-medium">
          {compact ? currentOption.code.toUpperCase() : currentOption.native}
        </span>
        <ChevronDown className="h-3 w-3 text-ink/40 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 top-full mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-peach/80 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-peach/40 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Select Language (भाषा)
            </span>
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLocale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-blush/60 font-bold text-berry"
                      : "text-ink/80 hover:bg-peach/30 hover:text-ink",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm" aria-hidden="true">{lang.flagEmoji}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink leading-tight">{lang.native}</span>
                      <span className="text-[10px] text-ink/50 leading-tight">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-berry" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
