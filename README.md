# FitTV AI

TV-first adaptive AI fitness coach for the Amazon Fire TV track (Fire OS / Vega OS).

**Structure:** Monorepo with separate `client` and `server`.

```
fittv-ai/
├── client/          ← React + TypeScript TV frontend (Phases 0-4)
├── server/          ← Express API (skeleton ready for Phase 5+)
├── package.json     ← Root scripts
└── README.md
```

## Quick Start (Windows PowerShell)

```powershell
# Install everything
npm run install:all

# Run both client + server together
npm run dev
```

- Frontend: http://localhost:5173  
- Backend:  http://localhost:3001  

Or run them separately:

```powershell
npm run dev:client
npm run dev:server
```

## Current Status

| Phase | Status |
|-------|--------|
| 0 – Platform Validation | Done |
| 1 – Requirements / PRD | Done |
| 2 – Project Foundation | Done |
| 3 – TV UI + Mock Data | Done |
| 4 – Workout Engine | Done |
| 5 – Backend + Persistence | Skeleton ready |
| 6 – AI Generation | Not started |

## Main Features Working Now

- Home dashboard + stats
- Curated workouts (offline)
- Personalization flow
- Full guided player (timer, pause, skip, adapt, end)
- Difficulty feedback
- Progress + streak (localStorage)
- TV-friendly focus & large typography
- Basic Express server with health + complete endpoints

## Important

- For the official hackathon demo video you **must** show the app running on a Fire TV device or the official simulator.
- No secrets are committed.
