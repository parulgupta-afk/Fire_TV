import { z } from 'zod';

export const ImpactSchema = z.enum(['low', 'standard']);
export type Impact = z.infer<typeof ImpactSchema>;

export const LevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export type Level = z.infer<typeof LevelSchema>;

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(80),
  instructions: z.string().min(1).max(400),
  durationSeconds: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  restSeconds: z.number().int().min(0).default(15),
  equipment: z.array(z.string()).default([]),
  impact: ImpactSchema.default('standard'),
  alternatives: z.array(z.string()).default([]),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export const WorkoutPlanSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  goal: z.string().min(1).max(60),
  level: LevelSchema,
  estimatedDurationMinutes: z.number().int().positive(),
  equipment: z.array(z.string()).default([]),
  impact: ImpactSchema.default('standard'),
  exercises: z.array(ExerciseSchema).min(1),
  coachNotes: z.string().max(300).optional(),
  isCurated: z.boolean().default(false),
});

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

export const DifficultyRatingSchema = z.enum(['too_easy', 'just_right', 'too_hard']);
export type DifficultyRating = z.infer<typeof DifficultyRatingSchema>;

export const CompletedWorkoutSchema = z.object({
  id: z.string(),
  workoutId: z.string(),
  title: z.string(),
  completedAt: z.string(), // ISO
  plannedDurationMinutes: z.number(),
  actualDurationSeconds: z.number(),
  completedExercises: z.number(),
  totalExercises: z.number(),
  difficultyRating: DifficultyRatingSchema.optional(),
  status: z.enum(['completed', 'stopped_early']),
});

export type CompletedWorkout = z.infer<typeof CompletedWorkoutSchema>;

export type PlayerState =
  | 'idle'
  | 'ready'
  | 'active'
  | 'resting'
  | 'paused'
  | 'completed'
  | 'stopped';

export interface PlayerSnapshot {
  state: PlayerState;
  currentExerciseIndex: number;
  secondsRemaining: number;
  isResting: boolean;
  completedExerciseIds: string[];
}
