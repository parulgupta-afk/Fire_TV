/**
 * Phase 8 – Simple fitness memory from feedback
 */

import { getHistory } from '../store.js';

export function getRecommendation() {
  const history = getHistory(30);
  if (history.length === 0) {
    return {
      message: 'Start with a short beginner low-impact workout.',
      suggestedLevel: 'beginner',
      suggestedImpact: 'low',
      suggestedDuration: 12,
    };
  }

  const recent = history.slice(0, 8);
  const ratings = recent
    .map((h) => h.difficultyRating)
    .filter(Boolean);

  let suggestedLevel = 'beginner';
  let suggestedImpact = 'low';
  let suggestedDuration = 15;
  let message = 'Based on your recent sessions, keep going at a comfortable pace.';

  const tooHard = ratings.filter((r) => r === 'too_hard').length;
  const tooEasy = ratings.filter((r) => r === 'too_easy').length;

  if (tooHard >= 2) {
    message = 'Several recent sessions felt hard. Try a shorter or lower-impact plan next.';
    suggestedDuration = 12;
    suggestedImpact = 'low';
  } else if (tooEasy >= 2) {
    message = 'You found recent sessions easy. You can try a slightly longer one.';
    suggestedDuration = 20;
    suggestedLevel = 'intermediate';
  } else {
    message = 'Your recent effort looks well balanced. A 15-minute session is a solid next step.';
  }

  return {
    message,
    suggestedLevel,
    suggestedImpact,
    suggestedDuration,
    basedOnSessions: recent.length,
  };
}
