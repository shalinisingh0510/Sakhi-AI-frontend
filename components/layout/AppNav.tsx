"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { useAnonymousTimerStore } from "@/lib/anonymous-timer-store";
import { authApi } from "@/lib/api";
import { normalizeUser } from "@/lib/api-config";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { useTranslations } from "next-intl";

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const t = useTranslations("Navigation");
  const tA11y = useTranslations("Accessibility");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { secondsRemaining, isExpired, isPaid, openPaywall } = useAnonymousTimerStore();
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const NAV_LINKS = [
    { href: "/dashboard", label: t("home"), icon: HomeIcon },
    { href: "/health", label: t("health"), icon: HeartIcon },
    { href: "/chat", label: t("chat"), icon: ChatIcon },
    { href: "/learn", label: t("learn"), icon: BookIcon },
    { href: "/caregivers", label: t("caregivers"), icon: CaregiverIcon },
    { href: "/tools", label: "Calculators", icon: ToolsIcon },
    { href: "/search", label: t("search"), icon: SearchIcon },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Client-side auth guard for private user pages only
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      const privatePrefixes = ["/profile", "/settings", "/dashboard"];
      if (privatePrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-peach/60 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🌸</span>
          <span className="font-display text-lg font-bold text-berry">Sakhi AI</span>
        </Link>

        <nav aria-label="App navigation" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const isHealthTab = href === "/health";

            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  if (isHealthTab && !isAuthenticated) {
                    e.preventDefault();
                    useAuthModalStore.getState().openAuthModal("health");
                  }
                }}
                className={[
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  active ? "bg-blush text-berry" : "text-ink/70 hover:bg-peach/40 hover:text-ink",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-full p-2 text-ink/60 transition-all hover:bg-peach/40"
            aria-label={t("search")}
          >
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/notifications"
            className="relative rounded-full p-2 text-ink/60 transition-all hover:bg-peach/40"
            aria-label={t("notifications")}
          >
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose" aria-hidden="true" />
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await authApi.createAnonymous();
                    const normalized = normalizeUser(res.user);
                    useAuthStore.getState().login(normalized, res.access_token);
                    useAnonymousModalStore.getState().openModal("shield");
                  } catch (e) {
                    console.error("Anonymous init failed:", e);
                  }
                }}
                className="flex items-center gap-1.5 rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-all"
                title="Flo-grade anonymous tracking without email"
              >
                <ShieldIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Anonymous Mode</span>
                <span className="sm:hidden">Anon</span>
              </button>

              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-peach/80 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-berry shadow-2xs hover:bg-blush/30 transition-all"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-berry/10 text-xs font-bold text-berry">
                  <PersonIcon className="h-3.5 w-3.5" />
                </span>
                <span>Sign In</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {user?.isAnonymous && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => useAnonymousModalStore.getState().openModal("shield")}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-400 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-all"
                    title="Anonymous Mode Active · Click to view recovery key & shield controls"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline">
                      {isPaid ? "🛡️ Anonymous Pro" : `🔒 Anon (${timerStr})`}
                    </span>
                    <span className="sm:hidden">{isPaid ? "Pro" : timerStr}</span>
                  </button>
                  {!isPaid && (
                    <button
                      type="button"
                      onClick={openPaywall}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-all ${
                        isExpired
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-amber-400 hover:bg-amber-300 text-ink"
                      }`}
                      title="Unlock unlimited anonymous mode"
                    >
                      {isExpired ? "Unlock" : "Upgrade"}
                    </button>
                  )}
                </div>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  ref={menuButtonRef}
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-peach/60 bg-white px-3 py-2 text-sm font-medium text-ink hover:border-berry/30 transition-all"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label={tA11y("profileMenu")}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                      user?.isAnonymous
                        ? "bg-gradient-to-br from-emerald-600 to-teal-700"
                        : "bg-gradient-to-br from-rose to-berry",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {user?.isAnonymous ? "🔒" : (user?.name?.[0]?.toUpperCase() ?? "S")}
                  </span>
                  <span className="hidden sm:block">
                    {user?.isAnonymous ? "Anonymous Mode" : (user?.name ?? t("profile"))}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1 w-52 rounded-2xl border border-peach/60 bg-white p-1.5 shadow-soft"
                  >
                    {user?.isAnonymous && (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                          onClick={() => {
                            setMenuOpen(false);
                            useAnonymousModalStore.getState().openModal("shield");
                          }}
                        >
                          <ShieldIcon className="h-4 w-4 text-emerald-600" />
                          <span>Privacy Shield & Key</span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-50"
                          onClick={() => {
                            setMenuOpen(false);
                            useAuthStore.getState().togglePanicBlur();
                          }}
                        >
                          <span>👀 Panic Hide (Alt+H)</span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-berry hover:bg-peach/30"
                          onClick={() => {
                            setMenuOpen(false);
                            useAnonymousModalStore.getState().openModal("convert");
                          }}
                        >
                          <span>🔗 Link Email (Convert)</span>
                        </button>
                        <hr className="my-1 border-peach/50" />
                      </>
                    )}

                    <Link
                      href="/profile"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-peach/40"
                      onClick={() => setMenuOpen(false)}
                    >
                      <PersonIcon className="h-4 w-4" aria-hidden="true" /> {t("profile")}
                    </Link>
                    <Link
                      href="/settings"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-peach/40"
                      onClick={() => setMenuOpen(false)}
                    >
                      <SettingsIcon className="h-4 w-4" aria-hidden="true" /> {t("settings")}
                    </Link>
                    <hr className="my-1 border-peach/50" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogoutIcon className="h-4 w-4" aria-hidden="true" /> {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AuthPromptModal />
    </header>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function HeartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
}
function SearchIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
function ChatIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function BookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function CaregiverIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function PersonIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>;
}
function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
function LogoutIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function ToolsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h4"/><path d="M7 16h4"/><path d="M14 12h3"/><path d="M14 16h3"/></svg>;
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
