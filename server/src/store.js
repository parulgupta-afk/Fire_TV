import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

export function getHistory(limit = 50) {
  return readHistory().slice(0, limit);
}

export function addCompletedWorkout(record) {
  const history = readHistory();
  history.unshift(record);
  // Keep last 100
  const trimmed = history.slice(0, 100);
  writeHistory(trimmed);
  return record;
}

export function getProgressSummary() {
  const history = readHistory();
  const totalSessions = history.length;
  const totalSeconds = history.reduce((sum, h) => sum + (h.actualDurationSeconds || 0), 0);
  const completedOnly = history.filter((h) => h.status === 'completed');

  // Simple streak calculation
  let streak = 0;
  if (completedOnly.length > 0) {
    const sorted = [...completedOnly].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const item of sorted) {
      const d = new Date(item.completedAt);
      d.setHours(0, 0, 0, 0);
      const diffDays = Math.round((current.getTime() - d.getTime()) / 86400000);
      if (diffDays === 0 || diffDays === 1) {
        streak += 1;
        current = d;
      } else {
        break;
      }
    }
  }

  return {
    totalSessions,
    totalMinutes: Math.round(totalSeconds / 60),
    streak,
    recent: history.slice(0, 15),
  };
}
