import { describe, it, expect } from 'vitest';
import { WorkoutEngine, calculateStreak, totalMinutes } from './workoutEngine';
import { CURATED_WORKOUTS } from '../../data/curatedWorkouts';
import { CompletedWorkout } from '../../types/workout';

describe('WorkoutEngine', () => {
  it('starts with first exercise', () => {
    const plan = CURATED_WORKOUTS[0];
    const engine = new WorkoutEngine(plan);
    engine.start();
    const snap = engine.getSnapshot();
    expect(snap.state).toBe('active');
    expect(snap.currentExerciseIndex).toBe(0);
    expect(snap.secondsRemaining).toBeGreaterThan(0);
    engine.destroy();
  });

  it('can pause and resume', () => {
    const engine = new WorkoutEngine(CURATED_WORKOUTS[0]);
    engine.start();
    engine.pause();
    expect(engine.getSnapshot().state).toBe('paused');
    engine.resume();
    expect(['active', 'resting']).toContain(engine.getSnapshot().state);
    engine.destroy();
  });

  it('adapts remaining exercises when shorter is requested', () => {
    const engine = new WorkoutEngine(CURATED_WORKOUTS[0]);
    engine.start();
    const before = engine.getCurrentExercise()?.durationSeconds ?? 0;
    engine.adapt({ shorter: true });
    const after = engine.getCurrentExercise()?.durationSeconds ?? 0;
    expect(after).toBeLessThanOrEqual(before);
    engine.destroy();
  });
});

describe('Progress helpers', () => {
  it('calculates total minutes', () => {
    const history: CompletedWorkout[] = [
      {
        id: '1',
        workoutId: 'w1',
        title: 'Test',
        completedAt: new Date().toISOString(),
        plannedDurationMinutes: 15,
        actualDurationSeconds: 600,
        completedExercises: 5,
        totalExercises: 5,
        status: 'completed',
      },
    ];
    expect(totalMinutes(history)).toBe(10);
  });

  it('returns 0 streak for empty history', () => {
    expect(calculateStreak([])).toBe(0);
  });
});
