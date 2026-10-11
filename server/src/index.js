import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { CURATED_WORKOUTS } from './data/curated.js';
import { getHistory, addCompletedWorkout, getProgressSummary } from './store.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fittv-ai-server',
    version: '0.5.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/workouts/ready', (req, res) => {
  res.json({
    workouts: CURATED_WORKOUTS,
    count: CURATED_WORKOUTS.length,
  });
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

app.get('/api/progress', (req, res) => {
  res.json(getProgressSummary());
});

app.get('/api/history', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  res.json({ history: getHistory(limit) });
});

app.post('/api/workouts/generate', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'AI workout generation will be added in Phase 6. Use /api/workouts/ready for now.',
    },
  });
});

app.post('/api/workouts/adapt', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Server-side adaptation will be enhanced in Phase 7. Client-side adapt is available.',
    },
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
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
  console.log(`FitTV AI server running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
