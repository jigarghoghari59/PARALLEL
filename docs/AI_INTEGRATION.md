# AI INTEGRATION (Gemini)

## Setup
```js
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const res = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL,
  contents: prompt,
  config: { responseMimeType: "application/json", temperature: 0.9 },
});
const data = JSON.parse(res.text);
```
Check current model names in the Google AI Studio docs and set `GEMINI_MODEL` accordingly. Keep the model name in env, never hardcode.

## Reliability Pipeline
1. Build prompt on the server from validated input
2. Call Gemini with JSON mime type
3. Strip code fences if present, `JSON.parse`
4. Validate with zod; assign stable IDs server-side if missing
5. On failure: retry once with "return valid JSON only"; then return `AI_INVALID_JSON`
6. Normalize: sort events by year, ensure `type`, `parentRealityId`, `parentEventId`

## Generate Universe: output shape
```json
{
  "originalDecision": "string",
  "category": "Education",
  "universes": [
    {
      "id": "reality-a",
      "name": "Robotics Engineer",
      "type": "alternative",
      "parentRealityId": null,
      "parentEventId": null,
      "summary": "A hypothetical ...",
      "career": "Robotics Engineer",
      "industry": "Automation",
      "location": "Pune, India",
      "skills": [], "opportunities": [], "challenges": [],
      "outcome": "A possible long-term outcome ...",
      "events": [
        { "id": "a-e1", "order": 1, "year": 2026, "age": 20,
          "title": "Begin Mechanical Engineering",
          "description": "...", "category": "Education",
          "skills": [], "opportunities": [], "challenges": [],
          "consequences": "..." }
      ]
    }
  ]
}
```

## Prompt Rules (system instruction)
- You write speculative fiction about alternate life paths. Not predictions.
- Realities must be clearly distinct (different industries, locations, or turning points).
- Events are chronological, within the requested duration, and connected to the original decision.
- 5 to 8 events per reality. Concrete, specific, non-generic.
- Avoid stereotypes and harmful or defamatory content about real people.
- Output JSON only.

## Branch Prompt: required inputs
originalDecision, selected reality (name, summary, career), selected event, existing timeline (titles + years), new "What if" question. Output: ONE child reality whose first event continues from the selected event's year; `parentRealityId` and `parentEventId` are set by the server.

## Simulate Day: output
`{ "realityId", "overview": {career, location, lifestyle, happiness, highlights[]}, "entries": [{ "time", "title", "description", "experience", "important": bool }] }`
Happiness is optional and labeled fictional.

## Compare: output
`{ "realities": [{ "id", "scores": { "incomePotential", "careerGrowth", "workLifeBalance", "innovationImpact" }, "summary" }], "takeaways": [], "finalSummary": "" }`
Scores are integers 1 to 10, shown as "illustrative AI-generated ratings".

## Safety
- Sanitize and length-limit user input (500 chars).
- Rate-limit endpoints (e.g., 20 requests per 15 min per IP).
- If input suggests self-harm or crisis, return a gentle supportive message instead of generating a scenario.
- Always display a speculative-fiction note in the UI.
