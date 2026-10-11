/**
 * Phase 7 – Adaptive coach (server-side constraints)
 */

import { v4 as uuidv4 } from 'uuid';

export function adaptWorkout(currentPlan, options = {}, completedIds = []) {
  if (!currentPlan || !Array.isArray(currentPlan.exercises)) {
    return { ok: false, error: 'Invalid plan' };
  }

  const completedSet = new Set(completedIds);
  const kept = currentPlan.exercises.filter((ex) => completedSet.has(ex.id));
  let remaining = currentPlan.exercises.filter((ex) => !completedSet.has(ex.id));

  if (options.shorter) {
    remaining = remaining.map((ex) => ({
      ...ex,
      durationSeconds: ex.durationSeconds
        ? Math.max(20, Math.round(ex.durationSeconds * 0.7))
        : ex.durationSeconds,
    }));
  }

  if (options.easier || options.noJumping) {
    remaining = remaining.map((ex) => {
      if (ex.alternatives && ex.alternatives.length > 0) {
        return {
          ...ex,
          name: ex.alternatives[0],
          instructions: `Modified (easier): ${ex.alternatives[0]}. ${ex.instructions}`,
          impact: 'low',
        };
      }
      // Soften name/instructions if no alternative
      return {
        ...ex,
        impact: 'low',
        instructions: `Take it easier: ${ex.instructions}`,
      };
    });
  }

  if (options.replaceExerciseId && options.replaceWith) {
    remaining = remaining.map((ex) =>
      ex.id === options.replaceExerciseId
        ? {
            ...ex,
            name: String(options.replaceWith).slice(0, 80),
            instructions: `Replacement: ${options.replaceWith}`,
          }
        : ex
    );
  }

  const newExercises = [...kept, ...remaining];
  const totalSec = newExercises.reduce(
    (s, e) => s + (e.durationSeconds || 30) + (e.restSeconds || 0),
    0
  );

  const adapted = {
    ...currentPlan,
    id: `adapted-${uuidv4().slice(0, 8)}`,
    title: `${currentPlan.title} (Adapted)`,
    exercises: newExercises,
    estimatedDurationMinutes: Math.max(5, Math.round(totalSec / 60)),
    impact: options.easier || options.noJumping ? 'low' : currentPlan.impact,
    source: 'adapted',
  };

  return { ok: true, plan: adapted };
}
