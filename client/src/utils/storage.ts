import { CompletedWorkout } from '../types/workout';
import { api } from '../services/api';

const HISTORY_KEY = 'fittv_history_v1';

export function loadHistory(): CompletedWorkout[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompletedWorkout[];
  } catch {
    return [];
  }
}

export function saveHistory(history: CompletedWorkout[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addToHistory(record: CompletedWorkout) {
  const history = loadHistory();
  history.unshift(record);
  saveHistory(history.slice(0, 50));

  // Best-effort sync to server (non-blocking)
  api
    .completeWorkout({
      workoutId: record.workoutId,
      title: record.title,
      plannedDurationMinutes: record.plannedDurationMinutes,
      actualDurationSeconds: record.actualDurationSeconds,
      completedExercises: record.completedExercises,
      totalExercises: record.totalExercises,
      difficultyRating: record.difficultyRating,
      status: record.status,
    })
    .catch(() => {
      // Server unavailable – local history is enough for MVP
    });

  return history;
}
