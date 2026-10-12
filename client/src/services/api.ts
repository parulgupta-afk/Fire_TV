import { WorkoutPlan, CompletedWorkout } from '../types/workout';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw {
        code: data?.error?.code || 'HTTP_ERROR',
        message: data?.error?.message || `Request failed (${res.status})`,
      } as ApiError;
    }

    return data as T;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'AbortError'
    ) {
      throw { code: 'TIMEOUT', message: 'Request timed out.' } as ApiError;
    }
    if (typeof err === 'object' && err !== null && 'code' in err) {
      throw err as ApiError;
    }
    throw { code: 'NETWORK_ERROR', message: 'Cannot reach server.' } as ApiError;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  getReadyWorkouts: () =>
    request<{ workouts: WorkoutPlan[]; count: number }>('/api/workouts/ready'),

  getWorkout: (id: string) =>
    request<{ workout: WorkoutPlan }>(`/api/workouts/ready/${id}`),

  generateWorkout: (prefs: {
    goal?: string;
    level?: string;
    durationMinutes?: number;
    impact?: string;
    equipment?: string[];
    recentFeedback?: string[];
  }) =>
    request<{ workout: WorkoutPlan; source?: string; warning?: string }>('/api/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(prefs),
    }),

  adaptWorkout: (payload: {
    plan: WorkoutPlan;
    options: {
      shorter?: boolean;
      easier?: boolean;
      noJumping?: boolean;
      replaceExerciseId?: string;
      replaceWith?: string;
    };
    completedExerciseIds?: string[];
  }) =>
    request<{ workout: WorkoutPlan }>('/api/workouts/adapt', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeWorkout: (payload: {
    workoutId: string;
    title: string;
    plannedDurationMinutes: number;
    actualDurationSeconds: number;
    completedExercises: number;
    totalExercises: number;
    difficultyRating?: string;
    status: 'completed' | 'stopped_early';
  }) =>
    request<{ success: boolean; record: CompletedWorkout }>('/api/workouts/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProgress: () =>
    request<{
      totalSessions: number;
      totalMinutes: number;
      streak: number;
      recent: CompletedWorkout[];
    }>('/api/progress'),

  /** Pass local guest history so recommendation is per-device, not shared server file. */
  getRecommendation: (history?: CompletedWorkout[]) =>
    request<{
      message: string;
      suggestedLevel: string;
      suggestedImpact: string;
      suggestedDuration: number;
      basedOnSessions?: number;
      reason?: string;
    }>('/api/coach/recommend', {
      method: 'POST',
      body: JSON.stringify({ history: history || [] }),
    }),
};
