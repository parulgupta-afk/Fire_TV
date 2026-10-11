import { v4 as uuidv4 } from 'uuid';
import {
  WorkoutPlan,
  Exercise,
  PlayerState,
  PlayerSnapshot,
  CompletedWorkout,
  DifficultyRating,
} from '../../types/workout';

export class WorkoutEngine {
  private plan: WorkoutPlan;
  private state: PlayerState = 'idle';
  private currentIndex = 0;
  private secondsRemaining = 0;
  private isResting = false;
  private completedIds: string[] = [];
  private startedAt: number | null = null;
  private pausedAt: number | null = null;
  private totalPausedMs = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private onTick: ((snapshot: PlayerSnapshot) => void) | null = null;
  private onComplete: ((record: CompletedWorkout) => void) | null = null;

  constructor(plan: WorkoutPlan) {
    this.plan = structuredClone(plan);
  }

  getPlan(): WorkoutPlan {
    return this.plan;
  }

  getSnapshot(): PlayerSnapshot {
    return {
      state: this.state,
      currentExerciseIndex: this.currentIndex,
      secondsRemaining: this.secondsRemaining,
      isResting: this.isResting,
      completedExerciseIds: [...this.completedIds],
    };
  }

  getCurrentExercise(): Exercise | null {
    if (this.currentIndex >= this.plan.exercises.length) return null;
    return this.plan.exercises[this.currentIndex];
  }

  getNextExercise(): Exercise | null {
    const nextIdx = this.currentIndex + 1;
    if (nextIdx >= this.plan.exercises.length) return null;
    return this.plan.exercises[nextIdx];
  }

  subscribe(onTick: (s: PlayerSnapshot) => void, onComplete?: (r: CompletedWorkout) => void) {
    this.onTick = onTick;
    this.onComplete = onComplete ?? null;
  }

  start() {
    if (this.state !== 'idle' && this.state !== 'ready') return;
    this.state = 'active';
    this.startedAt = Date.now();
    this.totalPausedMs = 0;
    this.loadCurrentExercise();
    this.startTimer();
    this.emit();
  }

  pause() {
    if (this.state !== 'active' && this.state !== 'resting') return;
    this.state = 'paused';
    this.pausedAt = Date.now();
    this.stopTimer();
    this.emit();
  }

  resume() {
    if (this.state !== 'paused') return;
    if (this.pausedAt) {
      this.totalPausedMs += Date.now() - this.pausedAt;
      this.pausedAt = null;
    }
    this.state = this.isResting ? 'resting' : 'active';
    this.startTimer();
    this.emit();
  }

  skip() {
    if (this.state === 'completed' || this.state === 'stopped') return;
    this.advance();
  }

  stop() {
    this.stopTimer();
    this.state = 'stopped';
    this.emit();
    this.finish('stopped_early');
  }

  /** Adapt remaining exercises (simple deterministic rules for Phase 4) */
  adapt(options: { shorter?: boolean; easier?: boolean; noJumping?: boolean }) {
    const remaining = this.plan.exercises.slice(this.currentIndex);
    let newExercises = [...remaining];

    if (options.shorter) {
      // Reduce duration of remaining timed exercises by ~30%
      newExercises = newExercises.map((ex) => ({
        ...ex,
        durationSeconds: ex.durationSeconds
          ? Math.max(20, Math.round(ex.durationSeconds * 0.7))
          : ex.durationSeconds,
      }));
    }

    if (options.easier || options.noJumping) {
      newExercises = newExercises.map((ex) => {
        // Prefer first alternative if available
        if (ex.alternatives.length > 0) {
          return {
            ...ex,
            name: ex.alternatives[0],
            instructions: `Modified: ${ex.alternatives[0]}. ${ex.instructions}`,
            impact: 'low' as const,
          };
        }
        return { ...ex, impact: 'low' as const };
      });
    }

    // Rebuild plan keeping completed history
    const completedPart = this.plan.exercises.slice(0, this.currentIndex);
    this.plan = {
      ...this.plan,
      title: `${this.plan.title} (Adapted)`,
      exercises: [...completedPart, ...newExercises],
      estimatedDurationMinutes: Math.max(
        5,
        Math.round(
          [...completedPart, ...newExercises].reduce(
            (sum, e) => sum + (e.durationSeconds ?? 30) + (e.restSeconds ?? 0),
            0
          ) / 60
        )
      ),
    };

    // Reload current if we are mid-exercise
    if (this.state === 'active' || this.state === 'resting' || this.state === 'paused') {
      this.loadCurrentExercise();
    }
    this.emit();
  }

  private loadCurrentExercise() {
    const ex = this.getCurrentExercise();
    if (!ex) {
      this.finish('completed');
      return;
    }
    this.isResting = false;
    this.secondsRemaining = ex.durationSeconds ?? 30;
    this.state = 'active';
  }

  private advance() {
    const current = this.getCurrentExercise();
    if (current && !this.completedIds.includes(current.id)) {
      this.completedIds.push(current.id);
    }

    // If just finished exercise, go to rest (if any)
    if (!this.isResting && current && (current.restSeconds ?? 0) > 0) {
      this.isResting = true;
      this.secondsRemaining = current.restSeconds ?? 15;
      this.state = 'resting';
      this.emit();
      return;
    }

    // Move to next exercise
    this.currentIndex += 1;
    if (this.currentIndex >= this.plan.exercises.length) {
      this.finish('completed');
      return;
    }
    this.loadCurrentExercise();
    this.emit();
  }

  private startTimer() {
    this.stopTimer();
    this.timerId = setInterval(() => {
      if (this.secondsRemaining <= 1) {
        this.advance();
      } else {
        this.secondsRemaining -= 1;
        this.emit();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private finish(status: 'completed' | 'stopped_early') {
    this.stopTimer();
    this.state = status === 'completed' ? 'completed' : 'stopped';
    const actualSeconds = this.startedAt
      ? Math.round((Date.now() - this.startedAt - this.totalPausedMs) / 1000)
      : 0;

    const record: CompletedWorkout = {
      id: uuidv4(),
      workoutId: this.plan.id,
      title: this.plan.title,
      completedAt: new Date().toISOString(),
      plannedDurationMinutes: this.plan.estimatedDurationMinutes,
      actualDurationSeconds: actualSeconds,
      completedExercises: this.completedIds.length,
      totalExercises: this.plan.exercises.length,
      status,
    };

    this.emit();
    if (this.onComplete) this.onComplete(record);
  }

  private emit() {
    if (this.onTick) this.onTick(this.getSnapshot());
  }

  destroy() {
    this.stopTimer();
    this.onTick = null;
    this.onComplete = null;
  }
}

/** Simple progress helpers (Phase 4) */
export function calculateStreak(history: CompletedWorkout[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history]
    .filter((h) => h.status === 'completed')
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  let streak = 0;
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
  return streak;
}

export function totalMinutes(history: CompletedWorkout[]): number {
  return Math.round(
    history.reduce((sum, h) => sum + h.actualDurationSeconds, 0) / 60
  );
}
