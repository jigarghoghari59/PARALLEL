# PARALLEL — Agent Rules

You are building PARALLEL, an AI-powered "digital parallel universe" web app. Read `/docs` before coding.
Source of truth: docs/PROJECT_OVERVIEW.md, FEATURES.md, ARCHITECTURE.md, AI_INTEGRATION.md, DESIGN_SYSTEM.md.

## Hard rules
1. Gemini API key is server-side only. Never reference it in `src/`. Frontend calls `VITE_API_URL` endpoints only.
2. Validate every AI JSON response on the server (zod) before sending to the client. Handle malformed JSON with one retry, then a clean error.
3. Preserve parent-child links: every branch has `parentRealityId` and `parentEventId`.
4. Never describe outcomes as guaranteed predictions. Show a "speculative fiction" note where outcomes appear.
5. Design: near-black (#050505), sage accent #C8E9A9, purple #9678C9 sparingly, thin borders, no heavy neon or blue. Follow docs/DESIGN_SYSTEM.md.
6. Every button must work. No static mockups. Add loading, error, and empty states.
7. Reusable components, small files, no unnecessary dependencies.
8. Work one phase at a time from `/prompts`. After each phase: run the app, fix errors, summarize what changed. Do not start the next phase unprompted.
9. Prefer JavaScript (JSX) unless told otherwise. Use ES modules.
10. Persist universes in LocalStorage via `src/services/universeService.js`.
