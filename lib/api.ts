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

interface ApiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ApiConversationDetail {
  conversation: {
    id: string;
  };
  messages: ApiMessage[];
}

export const chatApi = {
  sendMessage: async (content: string, sessionId: string | null, token: string, mode: "text" | "voice" = "text", language: string = "english") => {
    let res: ApiConversationDetail;
    if (!sessionId) {
      res = await request<ApiConversationDetail>("/conversations", {
        method: "POST",
        body: { initial_message: content, preferred_language: language, mode },
        token,
      });
    } else {
      res = await request<ApiConversationDetail>(`/conversations/${sessionId}/messages`, {
        method: "POST",
        body: { message: content, mode },
        token,
      });
    }
    const messages = res.messages || [];
    const lastMsg = messages[messages.length - 1];
    return {
      reply: lastMsg ? lastMsg.content : "",
      sessionId: res.conversation.id
    } as ChatResponse;
  },
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
  getAnalytics: (token: string) => request<Record<string, unknown>>("/analytics/user", { token }),
};

export interface CurrentCycleResponse {
  current_cycle_day?: number;
  latest_period_start?: string;
  data_quality: string;
  completed_cycles_count: number;
  estimated_next_period?: { date: string; confidence: string; algorithm_version: string };
  estimated_ovulation?: { date: string; confidence: string; algorithm_version: string };
  estimated_fertile_window?: { start: string; end: string; confidence: string; algorithm_version: string };
  irregularity_observation?: string;
}

export interface CycleStatisticsResponse {
  average_cycle_length?: number;
  average_period_duration?: number;
  shortest_cycle?: number;
  longest_cycle?: number;
  cycle_variability_days?: number;
  completed_cycles: number;
  has_irregular_pattern: boolean;
  irregularity_observation?: string;
}

export interface PeriodLogResponse {
  id: string;
  health_profile_id: string;
  start_date: string;
  end_date?: string;
  flow: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MenstrualCycleResponse {
  id: string;
  health_profile_id: string;
  cycle_start_date: string;
  cycle_end_date?: string;
  cycle_length_days?: number;
  period_duration_days?: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export const cycleApi = {
  getCurrentCycle: (token: string) =>
    request<CurrentCycleResponse>("/cycles/current", { token }),

  getStatistics: (token: string) =>
    request<CycleStatisticsResponse>("/cycles/statistics", { token }),

  listCycles: (token: string, limit: number = 12) =>
    request<MenstrualCycleResponse[]>(`/cycles?limit=${limit}`, { token }),

  listPeriods: (token: string) =>
    request<PeriodLogResponse[]>("/cycles/periods", { token }),

  logPeriod: (token: string, data: { start_date: string; end_date?: string; flow?: string; notes?: string }) =>
    request<PeriodLogResponse>("/cycles/periods", {
      method: "POST",
      body: data,
      token,
    }),

  updatePeriod: (token: string, logId: string, data: { end_date?: string; flow?: string; notes?: string }) =>
    request<PeriodLogResponse>(`/cycles/periods/${logId}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  deletePeriod: (token: string, logId: string) =>
    request<void>(`/cycles/periods/${logId}`, {
      method: "DELETE",
      token,
    }),
};

// ---------------------------------------------------------------------------
// Wellness API (Phase 3)
// ---------------------------------------------------------------------------

export interface SymptomLogCreate {
  symptom_code: string;
  category: string;
  severity: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}

export interface SymptomLogResponse extends SymptomLogCreate {
  id: string;
  health_profile_id: string;
  cycle_id?: string;
  cycle_day?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckInResponse {
  log_date: string;
  mood?: {
    id: string;
    mood_code: string;
    intensity: string;
    notes?: string;
  };
  energy?: {
    id: string;
    energy_level: string;
    notes?: string;
  };
  symptoms: SymptomLogResponse[];
}

export interface DashboardProfileSnapshot {
  is_complete: boolean;
  mode: string;
}

export interface TodaySnapshot {
  check_in_completed: boolean;
  mood?: string;
  energy?: string;
  symptoms_count: number;
  symptoms: Record<string, unknown>[];
}

export interface CycleSnapshot {
  cycle_day?: number;
  next_period?: string;
  ovulation?: string;
  confidence?: string;
}

export interface WellnessTrendsSnapshot {
  symptom_days_last_30: number;
  check_ins_last_7: number;
  check_ins_last_30: number;
}

export interface TrackingStatusSnapshot {
  check_in_status: string;
  cycle_status: string;
  symptoms_status: string;
}

export interface WellnessDashboardResponse {
  date: string;
  profile: DashboardProfileSnapshot;
  today: TodaySnapshot;
  cycle: CycleSnapshot;
  trends: WellnessTrendsSnapshot;
  tracking_status: TrackingStatusSnapshot;
}

export const wellnessApi = {
  getDashboard: (token: string, localDate?: string) => {
    const url = localDate ? `/wellness/dashboard?local_date=${localDate}` : "/wellness/dashboard";
    return request<WellnessDashboardResponse>(url, { token });
  },

  getTodayCheckIn: (token: string) =>
    request<DailyCheckInResponse>("/wellness/check-in/today", { token }),

  submitCheckIn: (token: string, data: Record<string, unknown>) =>
    request<DailyCheckInResponse>("/wellness/check-in", {
      method: "POST",
      body: data,
      token,
    }),

  listSymptoms: (token: string, limit: number = 50, offset: number = 0) =>
    request<SymptomLogResponse[]>(`/wellness/symptoms?limit=${limit}&offset=${offset}`, { token }),
    
  deleteSymptom: (token: string, logId: string) =>
    request<void>(`/wellness/symptoms/${logId}`, {
      method: "DELETE",
      token,
    }),
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

export interface HealthProfileData {
  id: string;
  user_id: string;
  date_of_birth: string;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string;
  diet_type: string;
  food_allergies: string[];
  dietary_restrictions: string[];
  cycle_tracking_enabled: boolean;
  nutrition_tracking_enabled: boolean;
  activity_tracking_enabled: boolean;
  ai_health_personalization_enabled: boolean;
  age_band: string;
  is_health_hub_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthProfileCreate {
  date_of_birth: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  activity_level: string;
  diet_type: string;
  food_allergies?: string[];
  dietary_restrictions?: string[];
  cycle_tracking_enabled?: boolean;
  nutrition_tracking_enabled?: boolean;
  activity_tracking_enabled?: boolean;
  ai_health_personalization_enabled?: boolean;
}

export interface HealthCondition {
  id: string;
  user_id: string;
  condition_code: string;
  display_name: string;
  status: string;
  reported_at: string;
  created_at: string;
}

export const healthApi = {
  ping: () => request<{ status: string }>("/health"),

  getProfile: (token: string) =>
    request<HealthProfileData>("/health-profile", { token }),

  createProfile: (data: HealthProfileCreate, token: string) =>
    request<HealthProfileData>("/health-profile", {
      method: "POST",
      body: data,
      token,
    }),

  updateProfile: (data: Partial<HealthProfileCreate>, token: string) =>
    request<HealthProfileData>("/health-profile", {
      method: "PATCH",
      body: data,
      token,
    }),

  getConditions: (token: string) =>
    request<HealthCondition[]>("/health-profile/conditions", { token }),

  addCondition: (
    data: { condition_code: string; display_name: string; notes?: string },
    token: string
  ) =>
    request<HealthCondition>("/health-profile/conditions", {
      method: "POST",
      body: data,
      token,
    }),

  removeCondition: (conditionId: string, token: string) =>
    request<void>(`/health-profile/conditions/${conditionId}`, {
      method: "DELETE",
      token,
    }),

  updatePermissions: (
    data: {
      cycle_tracking_enabled?: boolean;
      nutrition_tracking_enabled?: boolean;
      activity_tracking_enabled?: boolean;
      ai_health_personalization_enabled?: boolean;
    },
    token: string
  ) =>
    request<HealthProfileData>("/health-profile/permissions", {
      method: "PATCH",
      body: data,
      token,
    }),
};

// ---------------------------------------------------------------------------
// Nutrition API (Phase 5)
// ---------------------------------------------------------------------------

export interface NutritionFacts {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface FoodServingOptionResponse {
  id: string;
  food_id: string;
  serving_label: string;
  quantity_grams: number;
  is_default: boolean;
  sort_order: number;
}

export interface FoodSearchResultResponse {
  id: string;
  name_en: string;
  name_hi: string | null;
  category: string;
  diet_type: string;
  calories_per_100g: number;
  data_quality: string;
  default_serving_label: string | null;
  default_serving_grams: number | null;
  allergen_warnings: string[];
  is_diet_compatible: boolean;
}

export interface FoodSearchResponse {
  results: FoodSearchResultResponse[];
  total_count: number;
  page: number;
  page_size: number;
  query: string | null;
}

export interface FoodDetailResponse {
  id: string;
  name_en: string;
  name_hi: string | null;
  name_regional: string | null;
  category: string;
  cuisine: string | null;
  diet_type: string;
  search_aliases: string[];
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  iron_mg: number | null;
  calcium_mg: number | null;
  folate_mcg: number | null;
  data_quality: string;
  data_source: string | null;
  is_active: boolean;
  serving_options: FoodServingOptionResponse[];
  allergen_warnings: string[];
  is_diet_compatible: boolean;
}

export interface NutritionLogItemResponse {
  id: string;
  nutrition_log_id: string;
  food_id: string;
  serving_option_id: string | null;
  quantity_servings: number;
  quantity_grams: number;
  food_name_snapshot: string;
  calories_snapshot: number;
  protein_snapshot: number;
  carbs_snapshot: number;
  fat_snapshot: number;
  fiber_snapshot: number;
  created_at: string;
  updated_at: string;
}

export interface MealSummaryResponse {
  meal_type: string;
  items: NutritionLogItemResponse[];
  subtotal: NutritionFacts;
}

export interface DailyNutritionResponse {
  log_date: string;
  meals: MealSummaryResponse[];
  total: NutritionFacts;
  foods_logged_count: number;
  is_empty: boolean;
}

export interface NutritionHistoryEntry {
  log_date: string;
  total: NutritionFacts;
  foods_logged_count: number;
}

export interface NutritionHistoryResponse {
  entries: NutritionHistoryEntry[];
  start_date: string;
  end_date: string;
}

export interface NutritionLogItemCreate {
  food_id: string;
  serving_option_id?: string;
  quantity_servings: number;
  quantity_grams_override?: number;
  meal_type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";
  log_date: string;
}

export interface NutritionLogItemUpdate {
  serving_option_id?: string;
  quantity_servings?: number;
  quantity_grams_override?: number;
  meal_type?: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";
  log_date?: string;
}

export const nutritionApi = {
  searchFoods: (
    token: string,
    params: { q?: string; category?: string; diet_type?: string; page?: number; page_size?: number }
  ) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    if (params.diet_type) qs.set("diet_type", params.diet_type);
    if (params.page) qs.set("page", String(params.page));
    if (params.page_size) qs.set("page_size", String(params.page_size));
    return request<FoodSearchResponse>(`/nutrition/foods?${qs.toString()}`, { token });
  },

  getFoodDetail: (token: string, foodId: string) =>
    request<FoodDetailResponse>(`/nutrition/foods/${foodId}`, { token }),

  logFood: (token: string, data: NutritionLogItemCreate) =>
    request<NutritionLogItemResponse>("/nutrition/logs", {
      method: "POST",
      body: data,
      token,
    }),

  getTodaySummary: (token: string, localDate?: string) => {
    const url = localDate
      ? `/nutrition/logs/today?local_date=${localDate}`
      : "/nutrition/logs/today";
    return request<DailyNutritionResponse>(url, { token });
  },

  getHistory: (token: string, startDate?: string, endDate?: string) => {
    const qs = new URLSearchParams();
    if (startDate) qs.set("start_date", startDate);
    if (endDate) qs.set("end_date", endDate);
    return request<NutritionHistoryResponse>(`/nutrition/logs/history?${qs.toString()}`, { token });
  },

  updateLogItem: (token: string, itemId: string, data: NutritionLogItemUpdate) =>
    request<NutritionLogItemResponse>(`/nutrition/logs/items/${itemId}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  deleteLogItem: (token: string, itemId: string) =>
    request<void>(`/nutrition/logs/items/${itemId}`, {
      method: "DELETE",
      token,
    }),
};
