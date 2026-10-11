# FitTV AI

TV-first adaptive AI fitness coach for the **Amazon Developer Hackathon — Fire TV track** (Fire OS / Vega OS).

**Loop:** Personalize → Generate → Guide → Adapt → Track → Improve

```
fittv-ai/
├── client/     React + TypeScript TV frontend
├── server/     Express API, generation, adapt, persistence
└── docs/       Platform validation, PRD, test plan, demo script, submission checklist
```

## Quick Start (Windows PowerShell)

```powershell
cd fittv-ai
npm run install:all
npm run dev
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API health | http://localhost:3001/api/health |

**Local navigation:** Tab / Arrows + Enter  
**Fire TV:** Use the remote / simulator D-pad (required for official demo video)

## Features

- TV-friendly home dashboard with focus states
- Personalized workout generation (validated + curated fallback)
- Guided player: timer, pause/resume, skip, rest, end
- Mid-session adapt (shorter / easier)
- Difficulty feedback (Too easy / Just right / Too hard)
- Progress, minutes, streak
- Coach recommendation from past feedback
- Offline-capable curated workouts

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health |
| GET | `/api/workouts/ready` | Curated workouts |
| POST | `/api/workouts/generate` | Generate structured plan |
| POST | `/api/workouts/adapt` | Adapt remaining exercises |
| POST | `/api/workouts/complete` | Save session |
| GET | `/api/progress` | Stats + recent |
| GET | `/api/coach/recommend` | Feedback-based tip |

## Phase status

| Phase | Status |
|-------|--------|
| 0 Platform validation | Done |
| 1 Requirements | Done |
| 2 Foundation | Done |
| 3 TV UI | Done |
| 4 Workout engine | Done |
| 5 Backend + persistence | Done |
| 6 AI generation | Done |
| 7 Adaptive coach | Done |
| 8 Progress + memory | Done |
| 9 QA | Done (see `docs/TEST_PLAN.md`) |
| 10 Demo prep | Done (see `docs/DEMO_SCRIPT.md`) |
| 11 Submission readiness | Done (see `docs/SUBMISSION_CHECKLIST.md`) |

## Environment

Copy `server/.env.example` if needed. Optional later: `OPENAI_API_KEY` (default path uses a safe deterministic generator with validation).

## Limitations (honest)

- Demo video must show Fire TV device or official simulator — desktop browser alone is not enough.
- Generator is structured/deterministic by default; wire a real LLM only with server-side keys.
- Persistence is localStorage + JSON file (MVP).
- Not medical advice; users can skip/stop anytime.

## License

MIT (or as required by the hackathon).
