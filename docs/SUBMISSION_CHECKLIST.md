# FitTV AI — Submission Checklist (Phase 11)

## Official requirements (Build, Ship, Shape 2026)

- [ ] Registered on Devpost: https://amazonappdev2026.devpost.com/
- [ ] Primary track: **Fire TV**
- [ ] Demo video **under 3 minutes**, English, public YouTube/Vimeo
- [ ] Video shows app running on **Fire TV device OR Fire TV/Vega simulator**
- [ ] GitHub repo (public with license **or** private shared with Amazon collaborators)
- [ ] Product feedback filled for every tool/SDK used
- [ ] Optional: Friction log (up to 10% judging bonus)

Amazon collaborator usernames (add when submitting if private):  
`chris-trag`, `knmeiss`, `giolaq`, `anishamalde`, `mosesroth`, `emersonsklar`  
Also share with `testing@devpost.com` if required by current rules.

## Repo readiness

- [x] README with problem, solution, setup, limitations
- [x] No secrets in repo (`.env.example` only)
- [x] Client + server structure
- [x] Curated offline path
- [x] Validated generation path + fallback
- [x] Adaptive controls
- [x] Progress + feedback memory
- [ ] Screenshots from actual app (capture before submit)
- [ ] Demo video recorded from simulator/device

## Honest limitations to state in submission

1. Default generator is deterministic + validated (optional LLM key can be wired).
2. Persistence is localStorage + server JSON file (MVP scope).
3. Must be demonstrated inside Fire TV / Vega simulator for official compliance.
4. No computer vision, no medical claims, no guaranteed form correction.

## Suggested submission text (short)

**Problem:** Home workouts are hard to start and adapt on a TV with a remote.  
**Solution:** FitTV AI — Personalize → Generate → Guide → Adapt → Track on Fire OS / Vega OS.  
**Stack:** React + TypeScript (TV UI), Express API, structured generation with fallback, file/local persistence.  
**Demo path:** Curated + generated workouts, guided timer, mid-session adapt, difficulty feedback, progress.

## Deadline reminder

Submission deadline: **October 23, 2026** (check Devpost for exact timezone).
