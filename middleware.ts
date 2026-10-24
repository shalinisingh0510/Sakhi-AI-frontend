import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n-config';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// Routes that strictly require authentication and completed onboarding
const PROTECTED_PATHS = [
  "/dashboard",
  "/health/cycle",
  "/health/tracker",
  "/health/symptoms",
  "/health/activity",
  "/health/nutrition",
  "/health/check-in",
  "/profile",
  "/settings",
  "/progress",
  "/notifications",
  "/caregivers",
];

// Auth-only pages (for login and register)
const AUTH_PATHS = ["/login", "/register"];

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
  let isAnonymous = false;

  if (authRaw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authRaw));
      isAuthenticated = parsed?.state?.isAuthenticated ?? false;
      onboardingComplete = parsed?.state?.user?.onboardingComplete ?? false;
      isAnonymous = parsed?.state?.user?.isAnonymous ?? false;
    } catch {
      // invalid cookie — treat as unauthenticated
    }
  }

  // Extract locale accurately from supported locales list
  const pathSegments = pathname.split('/').filter(Boolean);
  const hasLocale = locales.includes(pathSegments[0] as any);
  const locale = hasLocale ? pathSegments[0] : defaultLocale;
  const pathnameWithoutLocale = hasLocale
    ? '/' + pathSegments.slice(1).join('/')
    : pathname;

  const isProtected = PROTECTED_PATHS.some((p) => pathnameWithoutLocale === p || pathnameWithoutLocale.startsWith(`${p}/`));
  const isAuthPage = AUTH_PATHS.some((p) => pathnameWithoutLocale === p || pathnameWithoutLocale.startsWith(`${p}/`));
  const isOnboarding = pathnameWithoutLocale === '/onboarding' || pathnameWithoutLocale.startsWith('/onboarding/');

  // If already authenticated and onboarded, redirect away from onboarding and auth pages
  if ((isOnboarding || isAuthPage) && isAuthenticated && (onboardingComplete || isAnonymous)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Redirect unauthenticated users away from protected routes to Flo questionnaire onboarding
  if (isProtected && !isAuthenticated) {
    const redirectUrl = encodeURIComponent(pathnameWithoutLocale);
    return NextResponse.redirect(new URL(`/${locale}/onboarding?redirect=${redirectUrl}`, request.url));
  }

  // Redirect authenticated but not-yet-onboarded non-anonymous users to onboarding from any protected route
  if (isAuthenticated && !isAnonymous && !onboardingComplete && isProtected) {
    if (!isOnboarding) {
      const redirectUrl = encodeURIComponent(pathnameWithoutLocale);
      return NextResponse.redirect(new URL(`/${locale}/onboarding?redirect=${redirectUrl}`, request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
