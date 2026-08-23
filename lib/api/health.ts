// Re-use the request function from the main api client
export interface HealthService {
  ping(token?: string): Promise<{ status: string }>;
}

// Temporary implementation since request isn't exported from api.ts
// In a real refactor, request would be moved to a shared utils file.
export const healthApi = {
  // We'll export this pattern to be consistent with authApi, chatApi, etc.
};
