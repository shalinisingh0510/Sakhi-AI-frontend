import type { User } from "./auth-store";
import { ApiError } from "./api-config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.sakhi.ai";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface ProgressResponse {
  completedModules: string[];
  streakDays: number;
  totalPoints: number;
}

export interface LearnModule {
  slug: string;
  title: string;
  desc: string;
  lessons: number;
  duration: string;
  progress: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new ApiError(error.message ?? `Request failed (${res.status})`, res.status);
  }

  return res.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
};

export const chatApi = {
  sendMessage: (content: string, sessionId: string | null, token: string) =>
    request<ChatResponse>("/chat/message", {
      method: "POST",
      body: { content, sessionId },
      token,
    }),
};

export const learnApi = {
  getModules: (token: string) =>
    request<{ modules: LearnModule[] }>("/learn/modules", { token }),

  getModule: (slug: string, token: string) =>
    request<{ module: LearnModule }>(`/learn/modules/${slug}`, { token }),

  completeLesson: (moduleId: string, lessonId: string, token: string) =>
    request<{ progress: number }>(`/learn/modules/${moduleId}/lessons/${lessonId}/complete`, {
      method: "POST",
      token,
    }),
};

export const progressApi = {
  getProgress: (token: string) => request<ProgressResponse>("/progress", { token }),
};

export interface ProfileUpdates {
  name?: string;
  ageGroup?: User["ageGroup"];
  language?: User["language"];
  onboardingComplete?: boolean;
}

export const profileApi = {
  getProfile: (token: string) => request<{ user: User }>("/profile", { token }),

  updateProfile: (updates: ProfileUpdates, token: string) =>
    request<{ user: User }>("/profile", {
      method: "PATCH",
      body: updates,
      token,
    }),
};
