/**
 * Fitness memory — uses guest history supplied by the client (localStorage source of truth).
 */

export function getRecommendation(history = []) {
  const list = Array.isArray(history) ? history : [];

  if (list.length === 0) {
    return {
      message: 'Start with a short beginner low-impact workout — no account needed.',
      suggestedLevel: 'beginner',
      suggestedImpact: 'low',
      suggestedDuration: 10,
      basedOnSessions: 0,
      reason: 'empty_history',
    };
  }

  const recent = list.slice(0, 8);
  const ratings = recent.map((h) => h.difficultyRating).filter(Boolean);
  const tooHard = ratings.filter((r) => r === 'too_hard').length;
  const tooEasy = ratings.filter((r) => r === 'too_easy').length;
  const avgMinutes =
    recent.reduce((s, h) => s + (Number(h.actualDurationSeconds) || 0), 0) /
    Math.max(1, recent.length) /
    60;

  let suggestedLevel = 'beginner';
  let suggestedImpact = 'low';
  let suggestedDuration = 12;
  let message = 'Based on your recent sessions, keep a comfortable pace.';
  let reason = 'balanced';

  if (tooHard >= 2) {
    message =
      'Several recent sessions felt hard. Try a shorter, lower-impact plan next.';
    suggestedDuration = Math.max(8, Math.round(avgMinutes * 0.75) || 10);
    suggestedImpact = 'low';
    suggestedLevel = 'beginner';
    reason = 'repeated_too_hard';
  } else if (tooEasy >= 2) {
    message =
      'You found recent sessions easy. A slightly longer or intermediate plan may fit.';
    suggestedDuration = Math.min(25, Math.round((avgMinutes || 12) + 5));
    suggestedLevel = 'intermediate';
    suggestedImpact = 'standard';
    reason = 'repeated_too_easy';
  } else if (tooHard === 1 && tooEasy === 0) {
    message = 'Last session was challenging. A moderate recovery-friendly plan is a solid next step.';
    suggestedDuration = 12;
    suggestedImpact = 'low';
    reason = 'recent_hard';
  } else {
    message = 'Your recent effort looks balanced. A focused 12–15 minute session fits well.';
    suggestedDuration = 15;
    reason = 'balanced';
  }

  return {
    message,
    suggestedLevel,
    suggestedImpact,
    suggestedDuration,
    basedOnSessions: recent.length,
    reason,
  };
}
