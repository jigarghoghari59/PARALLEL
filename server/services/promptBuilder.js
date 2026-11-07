// server/services/promptBuilder.js

export const SYSTEM_INSTRUCTION = `You are the multiverse generation engine for PARALLEL, an interactive speculative fiction platform.
Your purpose is to explore hypothetical alternate life trajectories stemming from pivotal human decisions.

CRITICAL RULES:
1. SPECULATIVE FICTION: These are narrative thought experiments and fictional explorations, NEVER guaranteed predictions or deterministic forecasts.
2. DISTINCT REALITIES: Each alternate reality must be clearly distinct in industry, geography, lifestyle, and turning points.
3. CHRONOLOGICAL TIMELINES: Events within each reality must follow a strict chronological sequence from the starting point over the requested duration.
4. SPECIFIC & CONCRETE: Avoid generic statements. Use specific job titles, technologies, organizations, and realistic personal milestones.
5. 5 TO 8 EVENTS: Provide between 5 to 8 sequential milestone events for each reality.
6. NO CODE FENCES: Return raw valid JSON only. Do not wrap in markdown \`\`\`json or \`\`\` code fences.
7. SAFETY: Avoid stereotypes, hate speech, or harmful/defamatory depictions.`;

export function buildGeneratePrompt({
  originalDecision,
  category = "Career",
  durationYears = 10,
  realitiesCount = 3,
}) {
  const startYear = new Date().getFullYear();
  const endYear = startYear + durationYears;

  return `Original Life Decision: "${originalDecision}"
Category: ${category}
Timeline Span: ${startYear} to ${endYear} (${durationYears} years)
Number of Realities Requested: ${realitiesCount}

Generate ${realitiesCount} distinct parallel life realities stemming from this decision:
- Reality 1 should be the "original" path (the baseline continuation).
- The remaining realities must be "alternative" divergent paths.

Each reality must include:
- "name": Concise evocative title (e.g., "The Robotics Path", "Academic Tenure")
- "type": "original" for the baseline, "alternative" for other paths
- "summary": 2-3 sentence overview of this life trajectory
- "career": Primary professional role
- "industry": Sector / field
- "location": City, Country
- "skills": 3-5 key skills acquired
- "opportunities": 2-3 unique opportunities unlocked
- "challenges": 2-3 hurdles faced
- "outcome": Long-term reflection on this life path
- "events": Array of 5 to 8 sequential events from ${startYear} to ${endYear}. Each event must have:
  - "order": Integer starting from 1
  - "year": Year between ${startYear} and ${endYear}
  - "title": Milestone title
  - "description": 1-2 sentence narrative
  - "category": e.g., "Education", "Career", "Relocation", "Personal"
  - "skills": Skills related to this event
  - "opportunities": Event opportunities
  - "challenges": Event challenges
  - "consequences": Lasting impact

Return a single JSON object with this exact shape:
{
  "originalDecision": "${originalDecision}",
  "category": "${category}",
  "universes": [
    /* array of realities */
  ]
}`;
}

export function buildBranchPrompt({
  originalDecision,
  selectedReality,
  selectedEvent,
  existingTimeline = [],
  question,
  durationYears = 5,
}) {
  const branchYear = selectedEvent.year;
  const endYear = branchYear + durationYears;

  const timelineSummary = existingTimeline
    .map((e) => `- ${e.year}: ${e.title}`)
    .join("\n");

  return `Context:
Original Decision: "${originalDecision}"
Current Reality: "${selectedReality.name}" (${selectedReality.career})
Branching Point Event (${selectedEvent.year}): "${selectedEvent.title}" - ${selectedEvent.description || ""}

Existing Timeline prior to branch:
${timelineSummary || `- ${selectedEvent.year}: ${selectedEvent.title}`}

New Turning Point Question:
"${question}"

Generate ONE new alternate child reality that branches directly off this event, spanning ${branchYear} to ${endYear}.
Provide:
- "name": New reality title reflecting the consequence of this question
- "type": "alternative"
- "summary": 2-3 sentences explaining how this branch diverged
- "career": Professional role in this branch
- "industry": Sector
- "location": City, Country
- "skills": Array of 3-5 skills
- "opportunities": Array of 2-3 opportunities
- "challenges": Array of 2-3 challenges
- "outcome": Speculative long-term outcome
- "events": 5 to 7 chronological events starting from ${branchYear} through ${endYear} illustrating this new path.

Return a single JSON object representing this reality.`;
}

export function buildSimulateDayPrompt({ reality }) {
  return `Speculative Day Simulation:
Reality Name: "${reality.name}"
Career: "${reality.career}"
Location: "${reality.location}"
Summary: "${reality.summary}"

Generate a vivid, immersive fictional single day in the life of this alternate version of the person.
Provide:
1. "overview":
   - "career": string
   - "location": string
   - "lifestyle": 1-2 sentences on daily pace and work-life balance
   - "happiness": e.g. "Fictional 8.5/10"
   - "highlights": 3 key moments of the day
2. "entries": Array of 5 to 7 timed chronological entries from morning to night.
   Each entry must have:
   - "time": e.g. "07:30 AM", "01:15 PM"
   - "title": Action or event title
   - "description": Concrete sensory description of the moment
   - "experience": Internal thoughts and emotions
   - "important": boolean (true for turning points or pivotal moments)

Return JSON with this exact shape:
{
  "realityId": "",
  "overview": { ... },
  "entries": [ ... ]
}`;
}

export function buildComparePrompt({ originalDecision = "", realities }) {
  const realitiesText = realities
    .map(
      (r, i) =>
        `Reality ${i + 1} [ID: ${r.id}]:
- Name: ${r.name}
- Career: ${r.career || "N/A"}
- Location: ${r.location || "N/A"}
- Summary: ${r.summary || "N/A"}
- Outcome: ${r.outcome || "N/A"}`
    )
    .join("\n\n");

  return `Compare the following alternate realities resulting from: "${originalDecision}":

${realitiesText}

Evaluate and compare these realities across 4 life dimensions.
For each reality, assign an illustrative AI rating from 1 to 10 for:
- "incomePotential": Financial stability and upside (1-10)
- "careerGrowth": Trajectory and advancement (1-10)
- "workLifeBalance": Personal time and wellbeing (1-10)
- "innovationImpact": Novelty, creativity, and societal contribution (1-10)

Provide:
- "realities": Array of evaluations with id, scores, and a 1-sentence analytical summary.
- "takeaways": 3-4 bullet comparative insights contrasting the paths.
- "finalSummary": 2-3 sentence philosophical conclusion about the trade-offs between these lives.

Return JSON with this exact shape:
{
  "realities": [
    {
      "id": "<matching id from input>",
      "scores": {
        "incomePotential": 8,
        "careerGrowth": 9,
        "workLifeBalance": 5,
        "innovationImpact": 9
      },
      "summary": "..."
    }
  ],
  "takeaways": [ "..." ],
  "finalSummary": "..."
}`;
}
