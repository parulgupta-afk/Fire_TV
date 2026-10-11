import { CompletedWorkout, DifficultyRating } from '../types/workout';
import { api } from '../services/api';

/** Guest progress is localStorage-first (source of truth on this device). */
const HISTORY_KEY = 'fittv_history_v2';
const PREFS_KEY = 'fittv_prefs_v1';
const STORAGE_VERSION = 2;

export interface GuestPrefs {
  lastGoal?: string;
  lastLevel?: string;
  lastImpact?: string;
  lastDuration?: number;
}

function migrateIfNeeded() {
  try {
    const v1 = localStorage.getItem('fittv_history_v1');
    if (v1 && !localStorage.getItem(HISTORY_KEY)) {
      localStorage.setItem(HISTORY_KEY, v1);
    }
    localStorage.setItem('fittv_storage_version', String(STORAGE_VERSION));
  } catch {
    /* ignore */
  }
}

migrateIfNeeded();

export function loadHistory(): CompletedWorkout[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (h) =>
        h &&
        typeof h.id === 'string' &&
        typeof h.title === 'string' &&
        typeof h.completedAt === 'string'
    ) as CompletedWorkout[];
  } catch {
    return [];
  }
}

export function saveHistory(history: CompletedWorkout[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function addToHistory(record: CompletedWorkout) {
  const history = loadHistory();
  // Prevent duplicate completion for same id
  if (history.some((h) => h.id === record.id)) {
    return history;
  }
  history.unshift(record);
  saveHistory(history);

  // Best-effort server mirror (not source of truth for this guest)
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
    .catch(() => {});

  return history;
}

export function updateHistoryRating(id: string, rating: DifficultyRating) {
  const history = loadHistory();
  const idx = history.findIndex((h) => h.id === id);
  if (idx < 0) return history;
  history[idx] = { ...history[idx], difficultyRating: rating };
  saveHistory(history);
  return history;
}

export function loadPrefs(): GuestPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as GuestPrefs) : {};
  } catch {
    return {};
  }
}

export function savePrefs(prefs: GuestPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/** Destructive — caller must confirm with user first. */
export function resetAllLocalProgress() {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem('fittv_history_v1');
  try {
    sessionStorage.removeItem('fittv_generated_plan');
  } catch {
    /* ignore */
  }
}
