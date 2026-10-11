/**
 * Deterministic structured workout generator with validation + curated fallback.
 * Does NOT claim external LLM generation unless a real provider call succeeds.
 */

import { v4 as uuidv4 } from 'uuid';
import { CURATED_WORKOUTS } from '../data/curated.js';

const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced'];
const ALLOWED_IMPACTS = ['low', 'standard'];

/** Explicit catalogue — equipment + impact + goals tags */
const CATALOGUE = [
  { name: 'March in Place', impact: 'low', equipment: [], duration: 40, goals: ['energy', 'mobility', 'strength', 'core'], level: ['beginner', 'intermediate', 'advanced'], role: 'warmup' },
  { name: 'Arm Circles + March', impact: 'low', equipment: [], duration: 35, goals: ['energy', 'mobility'], level: ['beginner', 'intermediate'], role: 'warmup' },
  { name: 'Side Steps', impact: 'low', equipment: [], duration: 40, goals: ['energy', 'mobility'], level: ['beginner', 'intermediate'], role: 'cardio' },
  { name: 'Step Touches', impact: 'low', equipment: [], duration: 40, goals: ['energy'], level: ['beginner', 'intermediate'], role: 'cardio' },
  { name: 'Gentle Step Jacks', impact: 'low', equipment: [], duration: 35, goals: ['energy'], level: ['beginner', 'intermediate'], role: 'cardio' },
  { name: 'Bodyweight Squats', impact: 'low', equipment: [], duration: 40, goals: ['strength'], level: ['beginner', 'intermediate', 'advanced'], role: 'strength' },
  { name: 'Chair Squats', impact: 'low', equipment: ['chair'], duration: 40, goals: ['strength'], level: ['beginner'], role: 'strength' },
  { name: 'Wall Push-ups', impact: 'low', equipment: [], duration: 40, goals: ['strength'], level: ['beginner', 'intermediate'], role: 'strength' },
  { name: 'Knee Push-ups', impact: 'low', equipment: [], duration: 35, goals: ['strength'], level: ['beginner', 'intermediate'], role: 'strength' },
  { name: 'Standing Knee Raises', impact: 'low', equipment: [], duration: 35, goals: ['core', 'mobility'], level: ['beginner', 'intermediate'], role: 'core' },
  { name: 'Glute Bridge', impact: 'low', equipment: [], duration: 40, goals: ['strength', 'core'], level: ['beginner', 'intermediate', 'advanced'], role: 'strength' },
  { name: 'Bird Dog', impact: 'low', equipment: [], duration: 40, goals: ['core', 'mobility'], level: ['beginner', 'intermediate', 'advanced'], role: 'core' },
  { name: 'Dead Bug (Modified)', impact: 'low', equipment: [], duration: 40, goals: ['core'], level: ['beginner', 'intermediate'], role: 'core' },
  { name: 'Pelvic Tilts', impact: 'low', equipment: [], duration: 35, goals: ['core', 'mobility'], level: ['beginner'], role: 'core' },
  { name: 'Side-Lying Leg Lifts', impact: 'low', equipment: [], duration: 40, goals: ['strength', 'core'], level: ['beginner', 'intermediate'], role: 'strength' },
  { name: 'Standing Hip Extensions', impact: 'low', equipment: [], duration: 35, goals: ['strength', 'mobility'], level: ['beginner', 'intermediate'], role: 'strength' },
  { name: 'Reverse Lunges (gentle)', impact: 'standard', equipment: [], duration: 40, goals: ['strength'], level: ['intermediate', 'advanced'], role: 'strength' },
  { name: 'Dumbbell Rows', impact: 'standard', equipment: ['dumbbells'], duration: 40, goals: ['strength'], level: ['intermediate', 'advanced'], role: 'strength' },
  { name: 'Dumbbell Shoulder Press', impact: 'standard', equipment: ['dumbbells'], duration: 35, goals: ['strength'], level: ['intermediate', 'advanced'], role: 'strength' },
  { name: 'Goblet Squat', impact: 'standard', equipment: ['dumbbells'], duration: 40, goals: ['strength'], level: ['intermediate', 'advanced'], role: 'strength' },
  { name: "Child's Pose Stretch", impact: 'low', equipment: [], duration: 45, goals: ['mobility', 'energy', 'strength', 'core'], level: ['beginner', 'intermediate', 'advanced'], role: 'cooldown' },
  { name: 'Cool Down Stretch', impact: 'low', equipment: [], duration: 45, goals: ['mobility', 'energy', 'strength', 'core'], level: ['beginner', 'intermediate', 'advanced'], role: 'cooldown' },
  { name: 'Seated Forward Fold', impact: 'low', equipment: ['chair'], duration: 40, goals: ['mobility'], level: ['beginner'], role: 'cooldown' },
  { name: 'Box Breathing', impact: 'low', equipment: [], duration: 40, goals: ['energy', 'mobility', 'core'], level: ['beginner', 'intermediate', 'advanced'], role: 'cooldown' },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeGoal(goal = '') {
  const g = String(goal).toLowerCase();
  if (g.includes('strength') || g.includes('strong')) return 'strength';
  if (g.includes('core') || g.includes('stability')) return 'core';
  if (g.includes('mobil') || g.includes('flex') || g.includes('move')) return 'mobility';
  return 'energy';
}

function buildDeterministicPlan(prefs) {
  const level = ALLOWED_LEVELS.includes(prefs.level) ? prefs.level : 'beginner';
  const impact = ALLOWED_IMPACTS.includes(prefs.impact) ? prefs.impact : 'low';
  const duration = clamp(Number(prefs.durationMinutes) || 15, 5, 40);
  const goalKey = normalizeGoal(prefs.goal);
  const goalLabel = String(prefs.goal || 'General fitness').slice(0, 60);
  const equipment = Array.isArray(prefs.equipment) ? prefs.equipment.map(String) : [];

  let pool = CATALOGUE.filter((e) => {
    if (impact === 'low' && e.impact !== 'low') return false;
    if (e.equipment.length && !e.equipment.every((eq) => equipment.includes(eq) || eq === 'chair')) {
      // allow bodyweight always; require listed equipment if exercise needs it
      if (e.equipment.length > 0 && !e.equipment.every((eq) => equipment.includes(eq))) return false;
    }
    if (!e.level.includes(level) && level === 'beginner' && e.level.includes('advanced') && !e.level.includes('beginner')) return false;
    return true;
  });

  // Prefer goal match
  const goalMatched = pool.filter((e) => e.goals.includes(goalKey));
  if (goalMatched.length >= 4) pool = goalMatched;

  const targetCount = clamp(Math.round(duration / 3.2), 3, 10);
  const selected = [];
  const used = new Set();

  const pick = (role) => {
    const candidates = pool.filter((e) => e.role === role && !used.has(e.name));
    if (!candidates.length) return null;
    const pickIdx = (level === 'advanced' ? candidates.length - 1 : 0);
    return candidates[Math.min(pickIdx, candidates.length - 1)];
  };

  const warm = pick('warmup') || pool.find((e) => !used.has(e.name));
  if (warm) {
    selected.push(warm);
    used.add(warm.name);
  }

  const rolesOrder =
    goalKey === 'strength'
      ? ['strength', 'strength', 'core', 'cardio']
      : goalKey === 'core'
        ? ['core', 'core', 'strength', 'mobility']
        : goalKey === 'mobility'
          ? ['mobility', 'core', 'strength', 'cardio']
          : ['cardio', 'strength', 'core', 'cardio'];

  for (const role of rolesOrder) {
    if (selected.length >= targetCount - 1) break;
    const item = pick(role) || pool.find((e) => !used.has(e.name) && e.role !== 'cooldown' && e.role !== 'warmup');
    if (item) {
      selected.push(item);
      used.add(item.name);
    }
  }

  while (selected.length < targetCount - 1) {
    const item = pool.find((e) => !used.has(e.name) && e.role !== 'cooldown');
    if (!item) break;
    selected.push(item);
    used.add(item.name);
  }

  const cool = pick('cooldown') || CATALOGUE.find((e) => e.role === 'cooldown');
  if (cool && !used.has(cool.name)) selected.push(cool);

  // Scale durations to fit requested minutes
  let totalSec = selected.reduce((s, e) => s + e.duration + 15, 0);
  const targetSec = duration * 60;
  const scale = totalSec > 0 ? clamp(targetSec / totalSec, 0.6, 1.4) : 1;

  const exercises = selected.map((ex, i) => {
    const dur = Math.max(20, Math.round(ex.duration * scale));
    const rest = i === selected.length - 1 ? 0 : level === 'beginner' ? 20 : 15;
    return {
      id: `gen-${i + 1}`,
      name: ex.name,
      instructions: `Perform ${ex.name} with controlled movement. Breathe steadily. Stop if you feel pain or unwell.`,
      durationSeconds: dur,
      restSeconds: rest,
      equipment: ex.equipment || [],
      impact: ex.impact,
      alternatives: ex.impact === 'standard' ? ['March in Place', 'Wall Push-ups'] : ['Seated March', 'Chair Squats'],
    };
  });

  const finalSec = exercises.reduce((s, e) => s + (e.durationSeconds || 0) + (e.restSeconds || 0), 0);

  return {
    id: `plan-${uuidv4().slice(0, 8)}`,
    title: `${goalLabel} · ${duration} min`,
    goal: goalLabel,
    level,
    estimatedDurationMinutes: Math.max(5, Math.round(finalSec / 60)),
    equipment,
    impact,
    isCurated: false,
    coachNotes:
      'Structured plan from your preferences. Skip or stop anytime. This is not medical advice.',
    exercises,
    source: 'deterministic-generator',
  };
}

function validatePlan(plan) {
  if (!plan || typeof plan !== 'object') return { ok: false, reason: 'not an object' };
  if (!plan.title || !Array.isArray(plan.exercises)) return { ok: false, reason: 'missing fields' };
  if (plan.exercises.length < 2 || plan.exercises.length > 15) return { ok: false, reason: 'count' };
  for (const ex of plan.exercises) {
    if (!ex.name || (!ex.durationSeconds && !ex.reps)) return { ok: false, reason: 'exercise' };
    if (ex.durationSeconds && (ex.durationSeconds < 10 || ex.durationSeconds > 180))
      return { ok: false, reason: 'duration' };
  }
  return { ok: true };
}

export async function generateWorkout(prefs = {}) {
  // Optional LLM path reserved — never claim LLM unless actually called successfully
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    // Intentionally not calling external API in default path; keep offline-reliable.
  }

  let plan = buildDeterministicPlan(prefs);
  const check = validatePlan(plan);
  if (!check.ok) {
    plan = {
      ...CURATED_WORKOUTS[0],
      id: `fallback-${uuidv4().slice(0, 8)}`,
      source: 'curated-fallback',
    };
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
