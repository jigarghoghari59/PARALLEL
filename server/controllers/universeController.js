// server/controllers/universeController.js
import crypto from "crypto";
import {
  generateRequestSchema,
  branchRequestSchema,
  simulateDayRequestSchema,
  compareRequestSchema,
  universeAiOutputSchema,
  branchAiOutputSchema,
  simulateDayAiOutputSchema,
  compareAiOutputSchema,
} from "../schemas/index.js";
import {
  SYSTEM_INSTRUCTION,
  buildGeneratePrompt,
  buildBranchPrompt,
  buildSimulateDayPrompt,
  buildComparePrompt,
} from "../services/promptBuilder.js";
import { generateJson } from "../services/geminiService.js";

function makeId(prefix = "id") {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function generateUniverse(req, res, next) {
  try {
    const validatedInput = generateRequestSchema.parse(req.body);

    const prompt = buildGeneratePrompt(validatedInput);
    const aiOutput = await generateJson(prompt, SYSTEM_INSTRUCTION, universeAiOutputSchema);

    const universeId = makeId("uni");
    const now = Date.now();

    // Normalize realities & events
    const normalizedRealities = (aiOutput.universes || []).map((reality, index) => {
      const realityId = makeId("real");
      const isOriginal = index === 0;

      // Sort events chronologically and assign stable IDs + orders
      const sortedEvents = (reality.events || [])
        .map((evt) => ({
          ...evt,
          year: Number(evt.year) || new Date().getFullYear() + 1,
        }))
        .sort((a, b) => a.year - b.year)
        .map((evt, evtIdx) => ({
          id: evt.id || makeId("evt"),
          order: evtIdx + 1,
          year: evt.year,
          age: evt.age,
          title: evt.title,
          description: evt.description,
          category: evt.category || "Milestone",
          skills: Array.isArray(evt.skills) ? evt.skills : [],
          opportunities: Array.isArray(evt.opportunities) ? evt.opportunities : [],
          challenges: Array.isArray(evt.challenges) ? evt.challenges : [],
          consequences: evt.consequences || "",
        }));

      return {
        id: realityId,
        universeId,
        name: reality.name,
        type: isOriginal ? "original" : "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: reality.summary,
        career: reality.career,
        industry: reality.industry || "General",
        location: reality.location || "Earth",
        skills: Array.isArray(reality.skills) ? reality.skills : [],
        opportunities: Array.isArray(reality.opportunities) ? reality.opportunities : [],
        challenges: Array.isArray(reality.challenges) ? reality.challenges : [],
        outcome: reality.outcome || "",
        events: sortedEvents,
        simulations: [],
      };
    });

    const universe = {
      id: universeId,
      originalDecision: validatedInput.originalDecision,
      category: validatedInput.category,
      durationYears: validatedInput.durationYears,
      createdAt: now,
      bookmarked: false,
      realities: normalizedRealities,
    };

    return res.status(200).json(universe);
  } catch (err) {
    next(err);
  }
}

export async function branchUniverse(req, res, next) {
  try {
    const validatedInput = branchRequestSchema.parse(req.body);

    const prompt = buildBranchPrompt(validatedInput);
    const aiOutput = await generateJson(prompt, SYSTEM_INSTRUCTION, branchAiOutputSchema);

    const realityId = makeId("real");

    // Normalize events starting from branch event year
    const sortedEvents = (aiOutput.events || [])
      .map((evt) => ({
        ...evt,
        year: Number(evt.year) || validatedInput.selectedEvent.year,
      }))
      .sort((a, b) => a.year - b.year)
      .map((evt, evtIdx) => ({
        id: evt.id || makeId("evt"),
        order: evtIdx + 1,
        year: evt.year,
        age: evt.age,
        title: evt.title,
        description: evt.description,
        category: evt.category || "Milestone",
        skills: Array.isArray(evt.skills) ? evt.skills : [],
        opportunities: Array.isArray(evt.opportunities) ? evt.opportunities : [],
        challenges: Array.isArray(evt.challenges) ? evt.challenges : [],
        consequences: evt.consequences || "",
      }));

    const childReality = {
      id: realityId,
      name: aiOutput.name,
      type: "alternative",
      parentRealityId: validatedInput.parentRealityId,
      parentEventId: validatedInput.parentEventId,
      summary: aiOutput.summary,
      career: aiOutput.career,
      industry: aiOutput.industry || "General",
      location: aiOutput.location || "Earth",
      skills: Array.isArray(aiOutput.skills) ? aiOutput.skills : [],
      opportunities: Array.isArray(aiOutput.opportunities) ? aiOutput.opportunities : [],
      challenges: Array.isArray(aiOutput.challenges) ? aiOutput.challenges : [],
      outcome: aiOutput.outcome || "",
      events: sortedEvents,
      simulations: [],
    };

    return res.status(200).json({ reality: childReality });
  } catch (err) {
    next(err);
  }
}

export async function simulateDay(req, res, next) {
  try {
    const validatedInput = simulateDayRequestSchema.parse(req.body);

    const prompt = buildSimulateDayPrompt(validatedInput);
    const aiOutput = await generateJson(prompt, SYSTEM_INSTRUCTION, simulateDayAiOutputSchema);

    const simulation = {
      realityId: validatedInput.realityId,
      overview: {
        career: aiOutput.overview.career || validatedInput.reality.career,
        location: aiOutput.overview.location || validatedInput.reality.location,
        lifestyle: aiOutput.overview.lifestyle || "Balanced day in this alternate life.",
        happiness: aiOutput.overview.happiness || "Fictional 8/10",
        highlights: Array.isArray(aiOutput.overview.highlights) ? aiOutput.overview.highlights : [],
      },
      entries: (aiOutput.entries || []).map((entry) => ({
        time: entry.time,
        title: entry.title,
        description: entry.description,
        experience: entry.experience || "",
        important: Boolean(entry.important),
      })),
      generatedAt: Date.now(),
    };

    return res.status(200).json({ simulation });
  } catch (err) {
    next(err);
  }
}

export async function compareRealities(req, res, next) {
  try {
    const validatedInput = compareRequestSchema.parse(req.body);

    const prompt = buildComparePrompt(validatedInput);
    const aiOutput = await generateJson(prompt, SYSTEM_INSTRUCTION, compareAiOutputSchema);

    return res.status(200).json({
      realities: aiOutput.realities,
      takeaways: aiOutput.takeaways,
      finalSummary: aiOutput.finalSummary,
      disclaimer: "Speculative fiction ratings — illustrative AI-generated scores for creative exploration only.",
    });
  } catch (err) {
    next(err);
  }
}
