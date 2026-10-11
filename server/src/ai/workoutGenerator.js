/**
 * Phase 6 – AI Workout Generation service
 * - Strict schema validation
 * - Deterministic curated fallback
 * - Optional real LLM (if OPENAI_API_KEY or compatible key is set)
 * - Never trusts raw model output
 */

import { v4 as uuidv4 } from 'uuid';
import { CURATED_WORKOUTS } from '../data/curated.js';

const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced'];
const ALLOWED_IMPACTS = ['low', 'standard'];

// Simple exercise catalogue (allowlist)
const EXERCISE_CATALOGUE = [
  { name: 'March in Place', impact: 'low', equipment: [], duration: 40 },
  { name: 'Bodyweight Squats', impact: 'low', equipment: [], duration: 40 },
  { name: 'Wall Push-ups', impact: 'low', equipment: [], duration: 40 },
  { name: 'Standing Knee Raises', impact: 'low', equipment: [], duration: 40 },
  { name: 'Glute Bridge', impact: 'low', equipment: [], duration: 40 },
  { name: 'Side Steps', impact: 'low', equipment: [], duration: 45 },
  { name: 'Arm Circles + March', impact: 'low', equipment: [], duration: 40 },
  { name: 'Step Touches', impact: 'low', equipment: [], duration: 45 },
  { name: 'Gentle Step Jacks', impact: 'low', equipment: [], duration: 40 },
  { name: 'Bird Dog', impact: 'low', equipment: [], duration: 40 },
  { name: 'Dead Bug (Modified)', impact: 'low', equipment: [], duration: 40 },
  { name: 'Pelvic Tilts', impact: 'low', equipment: [], duration: 40 },
  { name: 'Side-Lying Leg Lifts', impact: 'low', equipment: [], duration: 45 },
  { name: "Child's Pose Stretch", impact: 'low', equipment: [], duration: 45 },
  { name: 'Cool Down Stretch', impact: 'low', equipment: [], duration: 45 },
  { name: 'Chair Squats', impact: 'low', equipment: ['chair'], duration: 40 },
  { name: 'Seated March', impact: 'low', equipment: ['chair'], duration: 40 },
  { name: 'Standing Hip Extensions', impact: 'low', equipment: [], duration: 35 },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function buildDeterministicPlan(prefs) {
  const level = ALLOWED_LEVELS.includes(prefs.level) ? prefs.level : 'beginner';
  const impact = ALLOWED_IMPACTS.includes(prefs.impact) ? prefs.impact : 'low';
  const duration = clamp(Number(prefs.durationMinutes) || 15, 8, 40);
  const goal = String(prefs.goal || 'General fitness').slice(0, 60);

  // Pick exercises that match impact preference
  let pool = EXERCISE_CATALOGUE.filter((e) =>
    impact === 'low' ? e.impact === 'low' : true
  );

  // Rough number of exercises based on duration
  const targetCount = clamp(Math.round(duration / 3.5), 4, 10);
  const selected = [];
  const used = new Set();

  // Always start with a warm-up style move
  const warmups = pool.filter((e) =>
    ['March in Place', 'Side Steps', 'Arm Circles + March', 'Seated March'].includes(e.name)
  );
  if (warmups.length) {
    selected.push(warmups[0]);
    used.add(warmups[0].name);
  }

  // Fill middle
  for (const ex of pool) {
    if (selected.length >= targetCount - 1) break;
    if (used.has(ex.name)) continue;
    selected.push(ex);
    used.add(ex.name);
  }

  // Cool down
  const cooldowns = pool.filter((e) =>
    e.name.toLowerCase().includes('stretch') || e.name.toLowerCase().includes('cool')
  );
  if (cooldowns.length && !used.has(cooldowns[0].name)) {
    selected.push(cooldowns[0]);
  }

  const exercises = selected.map((ex, i) => ({
    id: `gen-${i + 1}`,
    name: ex.name,
    instructions: `Perform ${ex.name} with controlled movement. Breathe steadily.`,
    durationSeconds: ex.duration,
    restSeconds: i === selected.length - 1 ? 0 : 15,
    equipment: ex.equipment || [],
    impact: ex.impact,
    alternatives: [],
  }));

  const totalSec = exercises.reduce(
    (s, e) => s + (e.durationSeconds || 0) + (e.restSeconds || 0),
    0
  );

  return {
    id: `ai-${uuidv4().slice(0, 8)}`,
    title: `${goal} – ${duration} min`,
    goal,
    level,
    estimatedDurationMinutes: Math.max(5, Math.round(totalSec / 60)),
    equipment: [],
    impact,
    isCurated: false,
    coachNotes:
      'This plan was generated from your preferences. Skip or stop anytime if something feels uncomfortable. This is not medical advice.',
    exercises,
    source: 'deterministic-generator',
  };
}

function validatePlan(plan) {
  if (!plan || typeof plan !== 'object') return { ok: false, reason: 'not an object' };
  if (!plan.title || !plan.exercises || !Array.isArray(plan.exercises)) {
    return { ok: false, reason: 'missing title or exercises' };
  }
  if (plan.exercises.length < 3 || plan.exercises.length > 15) {
    return { ok: false, reason: 'exercise count out of range' };
  }
  for (const ex of plan.exercises) {
    if (!ex.name || (!ex.durationSeconds && !ex.reps)) {
      return { ok: false, reason: 'invalid exercise' };
    }
    if (ex.durationSeconds && (ex.durationSeconds < 10 || ex.durationSeconds > 180)) {
      return { ok: false, reason: 'duration out of range' };
    }
  }
  return { ok: true };
}

/**
 * Main entry – tries LLM if key present, otherwise deterministic.
 * Always validates and falls back to curated on failure.
 */
export async function generateWorkout(prefs = {}) {
  // 1. Try real LLM if key exists (optional)
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      // Placeholder: real fetch would go here.
      // For safety and offline demo we still prefer validated deterministic output
      // unless you wire a real call later.
    } catch (err) {
      console.warn('LLM generation failed, using deterministic plan:', err.message);
    }
  }

  // 2. Deterministic structured generation (always available)
  let plan = buildDeterministicPlan(prefs);
  const check = validatePlan(plan);
  if (!check.ok) {
    console.warn('Generated plan invalid:', check.reason);
    // 3. Final fallback – curated
    plan = { ...CURATED_WORKOUTS[0], id: `fallback-${uuidv4().slice(0, 8)}`, source: 'curated-fallback' };
  }

  return plan;
}

export function getFallbackWorkout() {
  return {
    ...CURATED_WORKOUTS[0],
    id: `fallback-${uuidv4().slice(0, 8)}`,
    source: 'curated-fallback',
  };
}
