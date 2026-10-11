# FitTV AI — Product Requirements Document (Phase 1)

## Problem
Home workouts are hard to start and adapt on a television. Users need large readable text, remote-friendly controls, and the ability to quickly shorten or simplify a session.

## Solution
TV-first AI fitness coach: Personalize → Generate → Guide → Adapt → Track → Improve.

## Primary Personas
- Beginner wanting guided home workouts with no/minimal equipment  
- Time-constrained user who needs to shorten a session  
- Household user who wants simple progress tracking  

## MVP Scope (Must Ship)

1. Home dashboard with primary “Start Workout” action and ready templates  
2. Personalization (goal, level, duration, equipment, impact)  
3. Curated ready-to-start workouts (offline fallback)  
4. Guided workout player (timer, pause/resume, skip, next, end)  
5. Quick adaptation controls (shorter, easier, no jumping)  
6. Post-workout difficulty rating (Too easy / Just right / Too hard)  
7. Progress / history screen  
8. Full directional (D-pad) navigation + visible focus states  
9. Loading / empty / error / retry states  
10. Safe fallback when AI is unavailable  

## Non-Goals (MVP)
- Medical advice or form correction  
- Computer vision  
- Voice control  
- Multi-profile / social features  
- Precise calorie estimates  

## Main User Journey
Launch → Home → Choose ready or personalize → Review plan → Start guided session → Adapt if needed → Complete → Rate difficulty → View progress

## Functional Requirements
- FR-01 Home dashboard  
- FR-02 Personalization  
- FR-03 Workout generation (mocked until Phase 6)  
- FR-04 Guided session with timer  
- FR-05 Adaptation  
- FR-06 Completion + difficulty feedback  
- FR-07 Progress history  
- FR-08 Offline/curated fallback  
- FR-09 Remote navigation  
- FR-10 Failure handling  

## Acceptance Criteria (MVP)
A user can complete a full curated workout using only remote-like controls, rate it, and see it appear in progress history. The app remains usable when the AI service is unavailable.
