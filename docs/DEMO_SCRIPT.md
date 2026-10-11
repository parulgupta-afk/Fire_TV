# FitTV AI — Demo Script (Phase 10)

**Target length:** 2–3 minutes  
**Required:** Show the app running on a **Fire TV device or official Fire TV / Vega simulator** (not only a desktop browser).

## Pre-demo setup

1. Start server + client:
   ```powershell
   cd fittv-ai
   npm run install:all
   npm run dev
   ```
2. Open the app in the Fire TV / Vega simulator (or load the web build into the permitted environment).
3. Have the remote (or simulator D-pad) ready.
4. Optional: clear localStorage once for a clean first-run feel.

## Demo flow (speak while navigating)

### 1. Launch & Home (15–20s)
> “FitTV AI is a TV-first fitness coach. On the home screen you see your progress, a coach tip based on past feedback, and ready-to-start workouts.”

- Highlight focus rings while moving between cards.
- Point out Sessions / Minutes / Streak.

### 2. Personalized generation (30–40s)
> “Users can personalize: goal, level, duration, and impact. We generate a structured plan on the server with validation and a safe curated fallback if anything fails.”

- Open **Start Personalized Workout**
- Pick options quickly
- **Generate Plan** → Preview list of exercises

### 3. Guided session + adapt (45–60s)
> “Start the workout. Large timer, clear instructions, pause, skip, and adapt without losing progress.”

- Start workout
- Pause → Resume
- Open **Adapt** → **Make Shorter** or **Make Easier**
- Skip one exercise if time is tight
- Complete or End after 1–2 exercises if needed for time

### 4. Feedback & progress (20–30s)
> “After the session we capture difficulty feedback. That feeds a simple recommendation on the next visit.”

- Rate **Just Right** (or Too Easy / Too Hard)
- Open **Progress** — show the new session

### 5. Resilience (optional 15s)
> “If the AI service is unavailable, curated workouts still work offline.”

- Mention fallback (or briefly show Generate with server stopped if you rehearsed it)

## Closing line
> “FitTV AI delivers a complete Personalize → Generate → Guide → Adapt → Track loop, built for the living room remote.”

## Backup
- Keep a short screen recording of the same flow in case live simulator fails.
- Demo only features that actually work (no claims about computer vision or medical accuracy).
