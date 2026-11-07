// server/schemas/index.js
import { z } from "zod";

/* ================================================================== */
/* 1. Request Body Schemas                                            */
/* ================================================================== */

export const generateRequestSchema = z.object({
  originalDecision: z
    .string()
    .min(10, "Decision must be at least 10 characters long")
    .max(500, "Decision cannot exceed 500 characters")
    .trim(),
  category: z
    .enum(["Career", "Education", "Relationships", "Location", "Lifestyle", "Personal"])
    .optional()
    .default("Career"),
  durationYears: z
    .coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 year")
    .max(50, "Duration cannot exceed 50 years")
    .optional()
    .default(10),
  realitiesCount: z
    .coerce
    .number()
    .int()
    .min(1, "Realities count must be at least 1")
    .max(4, "Realities count cannot exceed 4")
    .optional()
    .default(3),
});

export const branchRequestSchema = z.object({
  originalDecision: z.string().max(500).optional().default(""),
  parentRealityId: z.string().min(1, "parentRealityId is required"),
  parentEventId: z.string().min(1, "parentEventId is required"),
  selectedReality: z.object({
    name: z.string(),
    summary: z.string().optional().default(""),
    career: z.string().optional().default(""),
  }),
  selectedEvent: z.object({
    id: z.string().optional(),
    year: z.coerce.number().int(),
    age: z.coerce.number().int().optional(),
    title: z.string(),
    description: z.string().optional().default(""),
  }),
  existingTimeline: z
    .array(
      z.object({
        year: z.coerce.number().int(),
        title: z.string(),
      })
    )
    .optional()
    .default([]),
  question: z
    .string()
    .min(5, "Branch question must be at least 5 characters long")
    .max(500, "Branch question cannot exceed 500 characters")
    .trim(),
  durationYears: z.coerce.number().int().min(1).max(30).optional().default(5),
});

export const simulateDayRequestSchema = z.object({
  universeId: z.string().optional(),
  realityId: z.string().min(1, "realityId is required"),
  reality: z.object({
    name: z.string(),
    career: z.string(),
    industry: z.string().optional().default(""),
    location: z.string().optional().default("Earth"),
    summary: z.string().optional().default(""),
  }),
});

export const compareRequestSchema = z.object({
  originalDecision: z.string().optional().default(""),
  realities: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        career: z.string().optional().default(""),
        industry: z.string().optional().default(""),
        location: z.string().optional().default(""),
        summary: z.string().optional().default(""),
        outcome: z.string().optional().default(""),
      })
    )
    .min(2, "Must compare at least 2 realities")
    .max(3, "Cannot compare more than 3 realities"),
});

/* ================================================================== */
/* 2. AI Output Validation Schemas                                    */
/* ================================================================== */

export const eventSchema = z.object({
  id: z.string().optional(),
  order: z.coerce.number().int().optional(),
  year: z.coerce.number().int(),
  age: z.coerce.number().int().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional().default("Milestone"),
  skills: z.array(z.string()).optional().default([]),
  opportunities: z.array(z.string()).optional().default([]),
  challenges: z.array(z.string()).optional().default([]),
  consequences: z.string().optional().default(""),
});

export const realitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(["original", "alternative"]).optional().default("alternative"),
  parentRealityId: z.string().nullable().optional().default(null),
  parentEventId: z.string().nullable().optional().default(null),
  summary: z.string().min(1),
  career: z.string().min(1),
  industry: z.string().optional().default("Unspecified"),
  location: z.string().optional().default("Earth"),
  skills: z.array(z.string()).optional().default([]),
  opportunities: z.array(z.string()).optional().default([]),
  challenges: z.array(z.string()).optional().default([]),
  outcome: z.string().optional().default(""),
  events: z.array(eventSchema).min(1, "Reality must contain at least 1 event"),
});

// Universe output schema (handles both { universes: [...] } and { realities: [...] })
export const universeAiOutputSchema = z
  .object({
    originalDecision: z.string().optional(),
    category: z.string().optional(),
    universes: z.array(realitySchema).optional(),
    realities: z.array(realitySchema).optional(),
  })
  .transform((data) => {
    const list = data.universes || data.realities || [];
    return {
      originalDecision: data.originalDecision,
      category: data.category,
      universes: list,
    };
  })
  .refine((data) => data.universes.length > 0, {
    message: "AI output must contain at least one reality in universes or realities",
  });

export const branchAiOutputSchema = z.union([
  realitySchema,
  z.object({ reality: realitySchema }).transform((d) => d.reality),
  z.object({ realities: z.array(realitySchema) }).transform((d) => d.realities[0]),
]);

export const simulateDayAiOutputSchema = z.object({
  realityId: z.string().optional(),
  overview: z.object({
    career: z.string().optional().default(""),
    location: z.string().optional().default(""),
    lifestyle: z.string().optional().default(""),
    happiness: z.union([z.string(), z.number()]).optional().default("Fictional 8/10"),
    highlights: z.array(z.string()).optional().default([]),
  }),
  entries: z
    .array(
      z.object({
        time: z.string(),
        title: z.string(),
        description: z.string(),
        experience: z.string().optional().default(""),
        important: z.boolean().optional().default(false),
      })
    )
    .min(3, "Simulation must contain at least 3 daily entries"),
});

export const compareAiOutputSchema = z.object({
  realities: z
    .array(
      z.object({
        id: z.string(),
        scores: z.object({
          incomePotential: z.coerce.number().min(1).max(10),
          careerGrowth: z.coerce.number().min(1).max(10),
          workLifeBalance: z.coerce.number().min(1).max(10),
          innovationImpact: z.coerce.number().min(1).max(10),
        }),
        summary: z.string().optional().default(""),
      })
    )
    .min(2),
  takeaways: z.array(z.string()).optional().default([]),
  finalSummary: z.string().optional().default(""),
});
