import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory store for now (Phase 5 will add real persistence)
const history = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'fittv-ai-server', timestamp: new Date().toISOString() });
});

// Get curated / ready workouts (placeholder – real data later)
app.get('/api/workouts/ready', (req, res) => {
  res.json({
    workouts: [],
    message: 'Curated workouts currently served from client. Backend ready for Phase 5+.',
  });
});

// Complete workout
app.post('/api/workouts/complete', (req, res) => {
  const record = {
    id: uuidv4(),
    ...req.body,
    completedAt: new Date().toISOString(),
  };
  history.unshift(record);
  res.status(201).json({ success: true, record });
});

// Progress
app.get('/api/progress', (req, res) => {
  res.json({
    totalSessions: history.length,
    history: history.slice(0, 20),
  });
});

// Placeholder for future AI generation
app.post('/api/workouts/generate', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'AI workout generation will be added in Phase 6.',
    },
  });
});

app.listen(PORT, () => {
  console.log(`FitTV AI server running on http://localhost:${PORT}`);
});
