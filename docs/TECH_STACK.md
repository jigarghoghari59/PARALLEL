# TECH STACK

## Frontend
| Tool | Why |
|---|---|
| React + Vite (JSX) | Fast dev, simple |
| React Router | Page navigation |
| Tailwind CSS | Styling with design tokens |
| Framer Motion | Subtle transitions |
| Lucide React | Icons |
| @xyflow/react | Branching tree visualization |
| Recharts | Comparison charts (P2) |

Three.js / R3F: only if time allows. Use a CSS/SVG/image planet for MVP.

## Backend
| Tool | Why |
|---|---|
| Node.js 20+ | Runtime |
| Express | API |
| @google/genai | Gemini SDK |
| zod | Validate AI JSON and requests |
| cors, dotenv | Config |
| express-rate-limit | Protect your API key from abuse |

## Storage
LocalStorage for MVP. Later: MongoDB Atlas or PostgreSQL.

## Deployment
- Frontend: Vercel (set `VITE_API_URL`)
- Backend: Render (set `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_ORIGIN`)
- Note: Render free tier sleeps when idle; first request can be slow.

## Dev Tools
Antigravity (primary), Git + GitHub, VS Code (fallback), Postman/Thunder Client for API tests.
