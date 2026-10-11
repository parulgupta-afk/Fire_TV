# FitTV AI

TV-first adaptive AI fitness coach for Amazon Fire TV (Fire OS / Vega OS).

```
fittv-ai/
├── client/     ← React + TypeScript TV frontend
├── server/     ← Express API + AI generator + persistence
└── README.md
```

## Quick Start (Windows PowerShell)

```powershell
cd fittv-ai
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173  
- Backend:  http://localhost:3001/api/health  

## Phase Status

| Phase | Status |
|-------|--------|
| 0 Platform Validation | Done |
| 1 Requirements | Done |
| 2 Foundation | Done |
| 3 TV UI | Done |
| 4 Workout Engine | Done |
| 5 Backend + Persistence | Done |
| 6 AI Workout Generation | Done |
| 7 Adaptive Coach | Done |
| 8 Progress + Memory | Done |

## What works

- Personalized plan generation (structured + validated, curated fallback)
- Curated offline workouts
- Guided player with timer, pause, skip, adapt (shorter / easier)
- Difficulty feedback after sessions
- Coach recommendation based on past feedback
- Progress, minutes, streak
- Client works offline; server sync is best-effort

## API

| Method | Path | Notes |
|--------|------|-------|
| GET | /api/health | Health |
| GET | /api/workouts/ready | Curated list |
| POST | /api/workouts/generate | AI / deterministic plan |
| POST | /api/workouts/adapt | Adapt remaining exercises |
| POST | /api/workouts/complete | Save session |
| GET | /api/progress | Stats + recent |
| GET | /api/coach/recommend | Feedback-based tip |

Optional: set `OPENAI_API_KEY` in server env later for real LLM (currently uses safe deterministic generator + validation).
