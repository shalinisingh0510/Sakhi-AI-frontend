import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/chat", "/learn", "/profile", "/settings", "/progress", "/notifications", "/search", "/faq", "/help"];
// Routes only for unauthenticated users
const AUTH_PATHS = ["/login", "/register", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect authenticated but non-onboarded users to onboarding
  if (isAuthenticated && !onboardingComplete && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
