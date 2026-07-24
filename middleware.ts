import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n-config';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/chat", "/learn", "/profile", "/settings", "/progress", "/notifications", "/search", "/faq", "/help"];
// Routes only for unauthenticated users
const AUTH_PATHS = ["/login", "/register", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return intlMiddleware(request);
  }

  // Apply i18n middleware first
  const response = intlMiddleware(request);

  // Read persisted auth state from cookie (set by Zustand persist)
  const authRaw = request.cookies.get("sakhi-auth")?.value;
  let isAuthenticated = false;
  let onboardingComplete = false;

  if (authRaw) {
    try {
      const parsed = JSON.parse(authRaw);
      isAuthenticated = parsed?.state?.isAuthenticated ?? false;
      onboardingComplete = parsed?.state?.user?.onboardingComplete ?? false;
    } catch {
      // invalid cookie — treat as unauthenticated
    }
  }

  // Get pathname without locale prefix for route checking
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  
  const isProtected = PROTECTED_PATHS.some((p) => pathnameWithoutLocale.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathnameWithoutLocale.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Redirect authenticated but non-onboarded users to onboarding
  if (isAuthenticated && !onboardingComplete && pathnameWithoutLocale === "/dashboard") {
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
