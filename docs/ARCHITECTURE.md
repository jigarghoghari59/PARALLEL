# ARCHITECTURE

## Flow
User -> React Frontend -> Express Backend -> Gemini API -> Structured JSON -> zod validation -> Universe state -> Timeline visualization -> LocalStorage

## Responsibilities
**Frontend:** pages, forms, React Flow, state, LocalStorage, loading/error UI.
**Backend:** prompt building, Gemini calls, request + response validation, retry, rate limiting, error mapping.
**Storage:** universes, branches, settings.

## Folder Structure
```
digital-parallel-universe/
|-- public/ (images/, planets/, icons/)
|-- src/
|   |-- components/ (layout/, dashboard/, universe/, timeline/, common/)
|   |-- pages/ (Dashboard, CreateUniverse, UniverseExplorer, TimelineDetails,
|   |           CompareRealities, LifeSimulation, SavedUniverses, Settings)
|   |-- services/ (apiClient.js, universeService.js)
|   |-- hooks/ context/ utils/ data/
|   |-- App.jsx  main.jsx  index.css
|-- server/
|   |-- routes/ controllers/ services/ middleware/ schemas/
|   |-- index.js
|-- docs/  prompts/  .agent/rules/
|-- AGENTS.md  README.md  .env.example  .gitignore  package.json
```

## API Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/universe/generate` | Decision -> universe with realities |
| POST | `/api/universe/branch` | New child reality from selected event |
| POST | `/api/universe/simulate-day` | Fictional day for a reality |
| POST | `/api/universe/compare` | Comparison data for 2 to 3 realities |

## Data Model (client)
```
Universe { id, originalDecision, category, durationYears, createdAt, bookmarked, realities[] }
Reality  { id, universeId, name, type: original|alternative, parentRealityId|null,
           parentEventId|null, summary, career, industry, location, skills[], opportunities[],
           challenges[], outcome, events[], simulations[] }
Event    { id, order, year, age?, title, description, category, skills[], opportunities[],
           challenges[], consequences }
```

## State
React Context (`UniverseContext`) wraps universe list, active universe, CRUD helpers; syncs to LocalStorage.

## Error Handling
- Server returns `{ error: { code, message } }`
- Codes: VALIDATION, AI_INVALID_JSON, AI_UNAVAILABLE, RATE_LIMIT
- Client shows friendly messages plus retry
