import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { CURATED_WORKOUTS } from './data/curated.js';
import { getHistory, addCompletedWorkout, getProgressSummary } from './store.js';
import { generateWorkout, getFallbackWorkout } from './ai/workoutGenerator.js';
import { adaptWorkout } from './ai/adapter.js';
import { getRecommendation } from './ai/memory.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '120kb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fittv-ai-server',
    version: '0.8.0',
    timestamp: new Date().toISOString(),
  });
});

// Curated
app.get('/api/workouts/ready', (req, res) => {
  res.json({ workouts: CURATED_WORKOUTS, count: CURATED_WORKOUTS.length });
});

app.get('/api/workouts/ready/:id', (req, res) => {
  const workout = CURATED_WORKOUTS.find((w) => w.id === req.params.id);
  if (!workout) {
    return res.status(404).json({
      error: { code: 'WORKOUT_NOT_FOUND', message: 'Curated workout not found.' },
    });
  }
  res.json({ workout });
});

// Phase 6 – Generate
app.post('/api/workouts/generate', async (req, res) => {
  try {
    const prefs = {
      goal: req.body?.goal,
      level: req.body?.level,
      durationMinutes: req.body?.durationMinutes ?? req.body?.duration,
      impact: req.body?.impact,
      equipment: req.body?.equipment || [],
    };
    const plan = await generateWorkout(prefs);
    res.json({ workout: plan, source: plan.source || 'generator' });
  } catch (err) {
    console.error('Generate error:', err.message);
    const fallback = getFallbackWorkout();
    res.status(200).json({
      workout: fallback,
      source: 'curated-fallback',
      warning: 'Generation failed, returned safe fallback.',
    });
  }
});

// Phase 7 – Adapt
app.post('/api/workouts/adapt', (req, res) => {
  const { plan, options, completedExerciseIds } = req.body || {};
  const result = adaptWorkout(plan, options || {}, completedExerciseIds || []);
  if (!result.ok) {
    return res.status(400).json({
      error: { code: 'ADAPT_FAILED', message: result.error || 'Could not adapt workout.' },
    });
  }
  res.json({ workout: result.plan });
});

// Complete
app.post('/api/workouts/complete', (req, res) => {
  const body = req.body || {};
  if (!body.workoutId || !body.title) {
    return res.status(400).json({
      error: { code: 'INVALID_PAYLOAD', message: 'workoutId and title are required.' },
    });
  }
  const record = {
    id: uuidv4(),
    workoutId: String(body.workoutId).slice(0, 80),
    title: String(body.title).slice(0, 120),
    completedAt: new Date().toISOString(),
    plannedDurationMinutes: Number(body.plannedDurationMinutes) || 0,
    actualDurationSeconds: Number(body.actualDurationSeconds) || 0,
    completedExercises: Number(body.completedExercises) || 0,
    totalExercises: Number(body.totalExercises) || 0,
    difficultyRating: body.difficultyRating || null,
    status: body.status === 'stopped_early' ? 'stopped_early' : 'completed',
  };
  const saved = addCompletedWorkout(record);
  res.status(201).json({ success: true, record: saved });
});

// Progress + memory
app.get('/api/progress', (req, res) => {
  res.json(getProgressSummary());
});

app.get('/api/history', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  res.json({ history: getHistory(limit) });
});

// Phase 8 – Recommendation from feedback memory
app.get('/api/coach/recommend', (req, res) => {
  res.json(getRecommendation());
});

// Errors
app.use((err, req, res, next) => {
  console.error('Unhandled:', err.message);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' },
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Endpoint not found.' },
  });
});

app.listen(PORT, () => {
  console.log(`FitTV AI server v0.8 running on http://localhost:${PORT}`);
});
