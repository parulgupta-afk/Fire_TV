# FitTV AI — Test Plan & QA Notes (Phase 9)

## Automated tests

| Area | Location | Status |
|------|----------|--------|
| Workout engine (start, pause, adapt) | `client/src/features/workouts/workoutEngine.test.ts` | Written (run with `npm test` in client) |
| Schema types | Zod in `client/src/types/workout.ts` | Present |

**Note:** Run from client folder after `npm install`:

```powershell
cd client
npm test
```

## Manual TV / browser checklist

### Core flow (must pass)

- [ ] App loads at http://localhost:5173
- [ ] Home shows curated workouts and stats
- [ ] Tab / arrows move focus; Enter selects
- [ ] Personalize → Generate Plan → Preview appears
- [ ] Start workout → timer counts down
- [ ] Pause → Resume works
- [ ] Skip advances exercise / rest
- [ ] Adapt → Make Shorter / Make Easier updates remaining work
- [ ] End or finish → Feedback screen
- [ ] Rate difficulty → Progress updates
- [ ] Progress shows session count / minutes / streak

### Resilience

- [ ] Stop server → Generate still falls back to curated (or shows error then curated)
- [ ] Complete a session with server down → local history still saves
- [ ] Restart browser → local history still present

### API (server running)

```powershell
curl http://localhost:3001/api/health
curl http://localhost:3001/api/workouts/ready
curl -X POST http://localhost:3001/api/workouts/generate -H "Content-Type: application/json" -d "{\"goal\":\"strength\",\"level\":\"beginner\",\"durationMinutes\":12,\"impact\":\"low\"}"
curl http://localhost:3001/api/coach/recommend
```

### Known limitations (honest)

- Real LLM call is optional (deterministic generator is default; set OPENAI_API_KEY later if desired).
- Focus management is CSS + tabIndex (good for demo; spatial nav can be improved on device).
- Persistence is localStorage (client) + JSON file (server) — not multi-user / multi-device.
- Not yet packaged as VPKG / APK; web path must be shown inside Fire TV / Vega simulator for submission video.

## Bug list (Phase 9)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| — | — | No P0/P1 open in core demo path at time of writing | — |

P0 = blocks launch/demo · P1 = major feature broken · P2 = visible non-blocking · P3 = cosmetic
