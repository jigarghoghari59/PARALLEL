# FEATURES

Legend: MVP = Phase 1, P2 = Phase 2, P3 = Phase 3

## Pages
| # | Page | Route | Phase | Notes |
|---|---|---|---|---|
| 1 | Universe Dashboard | `/` | MVP | Hero, planet, stats, recent universes |
| 2 | Create Universe | `/create` | MVP | Decision, category, duration, realities count |
| 3 | Universe Explorer | `/explore/:universeId` | MVP | React Flow tree, side panel |
| 4 | Timeline Details | `/universe/:universeId/reality/:realityId` | MVP | Vertical event path, branch from event |
| 5 | Compare Realities | `/compare` | P2 | Side by side + Recharts, illustrative scores |
| 6 | Life Simulation | `/simulate/:universeId/:realityId` | P2 | Fictional day, Generate New Day |
| 7 | Saved Universes | `/saved` | MVP-lite / P2 | Grid, search, delete, bookmark |
| 8 | Settings | `/settings` | P2 | Theme, data export, clear data, about |
| - | Archive | `/archive` | P2 | Bookmarked/older universes |

## Feature Detail
### Create Universe
- Textarea (min 10 chars, max 500)
- Category: Career, Education, Relationships, Location, Lifestyle, Personal
- Duration: 5, 10, 20 years (custom optional)
- Realities: 1 to 4
- Loading state with cosmic messages; error + retry

### Explorer
- Original node highlighted (sage); alternates (purple accents)
- Zoom/pan, expand/collapse, category filter
- Right panel: name, path, description, skills, opportunities, challenges, outcome, "Explore This Reality"
- "Explore More Branches" -> opens branch dialog

### Timeline Details
- Events: year, age (optional), title, description, category, skills, opportunities, challenges, consequences
- Click an event -> "Create branch from this event" -> asks a "What if...?" question

### Compare (P2)
Career, skills, industry, opportunities, challenges, income potential, growth, work-life balance, innovation impact, long-term. Scores 1-10 labeled "AI-generated illustrative rating".

### Life Simulation (P2)
5 to 7 timed entries across one fictional day + overview panel. "Generate New Day".

### Persistence
LocalStorage keys: `parallel.universes`, `parallel.settings`. Export JSON, clear all.

## Out of Scope for MVP
Auth, cloud sync, sharing links, 3D multiverse, collaboration, PDF export.
