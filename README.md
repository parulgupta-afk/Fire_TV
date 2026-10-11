# FitTV AI

TV-first adaptive AI fitness coach for the Amazon Fire TV track (Fire OS / Vega OS).

```
fittv-ai/
├── client/          ← React + TypeScript TV frontend
├── server/          ← Express API + file persistence
├── package.json
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
| 1 Requirements / PRD | Done |
| 2 Project Foundation | Done |
| 3 TV UI + Mock Data | Done |
| 4 Workout Engine | Done |
| 5 Backend + Persistence | Done |
| 6 AI Generation | Next |

## API Endpoints (Phase 5)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/workouts/ready | List curated workouts |
| GET | /api/workouts/ready/:id | Single curated workout |
| POST | /api/workouts/complete | Save completed session |
| GET | /api/progress | Sessions, minutes, streak |
| GET | /api/history | Recent history |
| POST | /api/workouts/generate | (501 – Phase 6) |
| POST | /api/workouts/adapt | (501 – Phase 7) |

Persistence: JSON file at `server/data/history.json` (simple & reliable for MVP).

Client still works fully offline via localStorage. Server sync is best-effort.
