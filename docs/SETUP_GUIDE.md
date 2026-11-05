# SETUP GUIDE (Manual Steps)

## 1. Install
- Node.js 20+ (nodejs.org), verify `node -v`
- Git, verify `git --version`
- Antigravity (Google's agentic IDE); sign in with your Google account
- Optional: VS Code as fallback

## 2. Gemini API key
1. Open Google AI Studio (aistudio.google.com) and sign in
2. Get API key -> Create key
3. Copy it into `.env` as `GEMINI_API_KEY` (never into frontend code, never commit)

## 3. Project folder
```bash
mkdir digital-parallel-universe && cd digital-parallel-universe
git init
```
Copy this kit's files (docs/, prompts/, AGENTS.md, README.md, .env.example, .gitignore, .agent/) into it. Save your original spec as `docs/PARALLEL_SPEC.md`.

## 4. Open in Antigravity
File -> Open Folder -> select the project. Open the agent panel. Confirm rules are loaded (AGENTS.md or `.agent/rules/parallel.md`).

## 5. Run prompts in order
Paste `prompts/00_...` first, let the agent finish, run and test, then continue. Commit after each phase:
```bash
git add . && git commit -m "phase N: <name>"
```

## 6. GitHub
Create an empty repo on github.com, then:
```bash
git remote add origin <url> && git branch -M main && git push -u origin main
```

## 7. Deploy backend (Render)
New -> Web Service -> connect repo. Build: `npm install`. Start: `node server/index.js`. Env vars: GEMINI_API_KEY, GEMINI_MODEL, CLIENT_ORIGIN (your Vercel URL, set after step 8).

## 8. Deploy frontend (Vercel)
Import repo. Framework: Vite. Env var: `VITE_API_URL` = your Render URL. Deploy. Copy the Vercel URL into Render's `CLIENT_ORIGIN` and redeploy the backend.

## 9. Final checks
- Generate a universe on the live site
- Branch from an event, refresh, confirm persistence
- Test at phone width
- Confirm no key appears in browser DevTools (Network/Sources)

## Troubleshooting
| Problem | Fix |
|---|---|
| CORS error | `CLIENT_ORIGIN` must match frontend URL exactly (no trailing slash) |
| 429 / quota | Wait, or lower request rate; check free-tier limits |
| Invalid JSON | Check server logs; retry logic should handle; lower temperature |
| Blank React Flow | Import `@xyflow/react/dist/style.css`; parent needs explicit height |
| Slow first request on Render | Free tier cold start; wait ~30s |
