# FitTV AI — Platform Validation (Phase 0)

**Date:** 2026-10-11  
**Status:** Completed under documented assumptions

## Official Hackathon Facts (Verified)

- Event: Build, Ship, Shape: Amazon Developer Hackathon  
- Deadline: October 23, 2026 (12:00 pm PT)  
- Fire TV track: Demo-ready app that runs on **Fire OS or Vega OS**  
- Any framework accepted (React Native, web technologies, Android/Kotlin/Java)  
- Demo video (< 3 min) **must** show the app running on a real Fire TV device **or** the official Fire TV / Vega simulator  
- Physical device is **not** required  
- Fitness is an explicit priority category  

Sources:  
- https://amazonappdev2026.devpost.com/  
- https://amazonappdev2026.devpost.com/rules  

## Platform Decision

| Option | Chosen? | Rationale |
|--------|---------|-----------|
| React + TypeScript (Vite) web app | **Yes (MVP)** | Fastest path to polished TV UI, excellent focus management with CSS + keyboard simulation, officially supported via web technologies / WebView on both Fire OS and Vega OS |
| React Native multi-TV | Future upgrade | Strong official starters exist; more native feel but higher setup cost |
| Native Android (Kotlin) | No | Heavier for the MVP scope and AI integration |

**Target for demo video:** Fire TV / Vega simulator (or physical device if available).

## Assumptions Made (Unverified until user confirms)

1. Developer machine is Linux or macOS (Windows is usable for the web path).  
2. No physical Fire TV is currently available → simulator path is the primary validation route.  
3. User will package/run the web app inside the permitted Fire TV or Vega simulator for the final demo video.  
4. Backend will be a simple Node/Express service (added in later phases) or can stay client-side for pure offline demo.

## Prerequisites

- Node.js 20+  
- npm or pnpm  
- Modern browser for local development  
- For real target testing: Amazon Vega Virtual Device or Android TV emulator + Fire TV tools  

## Go / No-Go Checklist

- [x] Official rules read and understood  
- [x] Fire OS **or** Vega OS target confirmed as acceptable  
- [x] Simulator path confirmed as valid for demo video  
- [x] Framework chosen and documented  
- [ ] User confirmed development OS and device access (still open)  
- [ ] Minimal “Hello TV” proof-of-concept launched on simulator (to be done by user)  

## Known Risks

- Web app running only in a desktop browser does **not** satisfy the demo requirement.  
- Focus management and D-pad behaviour must be thoroughly tested on the actual simulator.  
- Vega OS packaging (VPKG) has a different toolchain; web path reduces this friction.  

## Smallest Proof-of-Concept Plan

1. `npm create vite@latest` → React + TS  
2. Add large typography, visible focus rings, arrow-key navigation  
3. Launch in browser, then package / load into Fire TV / Vega simulator  
4. Verify directional navigation and Back behaviour  

**Acceptance:** App launches, focus is visible, Select and Back work with simulated remote.
