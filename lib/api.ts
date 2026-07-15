// Base API service module for Sakhi AI
// All backend calls go through here

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.sakhi-ai.com";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: unknown; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    request<{ user: unknown; token: string }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
};

// ─── Chat ────────────────────────────────────────────────────────────────────
export const chatApi = {
  sendMessage: (content: string, sessionId: string | null, token: string) =>
    request<{ reply: string; sessionId: string }>("/chat/message", {
      method: "POST",
      body: { content, sessionId },
      token,
    }),
};

// ─── Learn ───────────────────────────────────────────────────────────────────
export const learnApi = {
  getModules: (token: string) =>
    request<{ modules: unknown[] }>("/learn/modules", { token }),

  getModule: (slug: string, token: string) =>
    request<{ module: unknown }>(`/learn/modules/${slug}`, { token }),

  completeLesson: (moduleId: string, lessonId: string, token: string) =>
    request<{ progress: number }>(`/learn/modules/${moduleId}/lessons/${lessonId}/complete`, {
      method: "POST",
      token,
    }),
};

// ─── Progress ────────────────────────────────────────────────────────────────
export const progressApi = {
  getProgress: (token: string) =>
    request<{ completedModules: string[]; streakDays: number; totalPoints: number }>(
      "/progress",
      { token }
    ),
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export const profileApi = {
  getProfile: (token: string) =>
    request<{ user: unknown }>("/profile", { token }),

  updateProfile: (updates: unknown, token: string) =>
    request<{ user: unknown }>("/profile", {
      method: "PATCH",
      body: updates,
      token,
    }),
};
