import type { AgeGroup, SupportedLanguage, User } from "./auth-store";

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_DEMO_MODE !== "false";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function normalizeUser(raw: unknown, fallbackEmail = ""): User {
  const u = (raw ?? {}) as Partial<User>;
  return {
    id: u.id ?? `user-${Date.now()}`,
    name: u.name ?? "",
    email: u.email ?? fallbackEmail,
    ageGroup: (u.ageGroup as AgeGroup) ?? "18+",
    language: (u.language as SupportedLanguage) ?? "en",
    avatarUrl: u.avatarUrl,
    onboardingComplete: u.onboardingComplete ?? false,
  };
}

export function demoDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
