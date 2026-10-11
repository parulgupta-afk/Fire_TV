import { CompletedWorkout } from '../types/workout';

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
  // Keep last 50
  saveHistory(history.slice(0, 50));
  return history;
}
