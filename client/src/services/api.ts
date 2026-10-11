const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  code: string;
  message: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
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
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out.' } as ApiError;
    }
    if (err.code) throw err;
    throw { code: 'NETWORK_ERROR', message: 'Cannot reach server.' } as ApiError;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  getReadyWorkouts: () =>
    request<{ workouts: any[]; count: number }>('/api/workouts/ready'),

  getWorkout: (id: string) =>
    request<{ workout: any }>(`/api/workouts/ready/${id}`),

  completeWorkout: (payload: {
    workoutId: string;
    title: string;
    plannedDurationMinutes: number;
    actualDurationSeconds: number;
    completedExercises: number;
    totalExercises: number;
    difficultyRating?: string;
    status: 'completed' | 'stopped_early';
  }) => request<{ success: boolean; record: any }>('/api/workouts/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  getProgress: () =>
    request<{
      totalSessions: number;
      totalMinutes: number;
      streak: number;
      recent: any[];
    }>('/api/progress'),
};
