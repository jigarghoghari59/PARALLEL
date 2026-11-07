// server/services/geminiService.js
import { GoogleGenAI } from "@google/genai";

export class AiError extends Error {
  constructor(code, message, statusCode = 500) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function cleanJsonText(rawText) {
  if (!rawText) return "";
  let cleaned = String(rawText).trim();

  // Strip leading code fence
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "");
  }

  // Strip trailing code fence
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/\s*```$/, "");
  }

  return cleaned.trim();
}

/**
 * Calls Gemini with automatic 1x retry on malformed JSON or validation failure.
 *
 * @param {string} prompt
 * @param {string} systemInstruction
 * @param {import("zod").ZodType} schema - Zod schema to validate parsed output
 * @returns {Promise<any>}
 */
export async function generateJson(prompt, systemInstruction = "", schema = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  // Check API key availability
  if (!apiKey || apiKey === "mock" || process.env.MOCK_AI === "true") {
    // If mock mode is explicitly requested or no key provided, handle mock generator
    return generateMockResponse(prompt, schema);
  }

  let ai;
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    throw new AiError("AI_UNAVAILABLE", `Failed to initialize Gemini client: ${err.message}`, 503);
  }

  // Attempt 1
  try {
    const rawResult = await callGeminiModel(ai, model, prompt, systemInstruction);
    const parsed = parseAndValidate(rawResult, schema);
    return parsed;
  } catch (err1) {
    console.warn(`[GeminiService] Attempt 1 failed (${err1.code || err1.message}). Retrying once...`);

    // Retry once with an explicit reminder prompt
    try {
      const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous response failed validation. Return ONLY a single raw valid JSON object adhering strictly to the required schema. Do NOT include markdown code blocks or any extraneous text.`;
      const retryResult = await callGeminiModel(ai, model, retryPrompt, systemInstruction);
      const parsedRetry = parseAndValidate(retryResult, schema);
      return parsedRetry;
    } catch (err2) {
      console.error(`[GeminiService] Attempt 2 failed: ${err2.message}`);
      if (err2 instanceof AiError) {
        throw err2;
      }
      throw new AiError(
        "AI_INVALID_JSON",
        `AI generated invalid JSON structure after retry: ${err2.message}`,
        502
      );
    }
  }
}

async function callGeminiModel(ai, model, contents, systemInstruction) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
        systemInstruction: systemInstruction || undefined,
      },
    });

    const text = response.text;
    if (!text) {
      throw new AiError("AI_UNAVAILABLE", "Gemini returned an empty response", 502);
    }
    return text;
  } catch (err) {
    if (err instanceof AiError) throw err;
    throw new AiError("AI_UNAVAILABLE", `Gemini API request failed: ${err.message}`, 503);
  }
}

function parseAndValidate(rawText, schema) {
  const cleaned = cleanJsonText(rawText);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (jsonErr) {
    throw new AiError("AI_INVALID_JSON", `Malformed JSON from AI model: ${jsonErr.message}`, 502);
  }

  if (schema) {
    const validation = schema.safeParse(parsed);
    if (!validation.success) {
      const issues = validation.error.issues || validation.error.errors || [];
      const details = issues.map((e) => `${(e.path || []).join(".")}: ${e.message}`).join(", ");
      throw new AiError("VALIDATION", `AI output schema mismatch: ${details}`, 502);
    }
    return validation.data;
  }

  return parsed;
}

/**
 * Deterministic, realistic mock fallback when GEMINI_API_KEY is unset or MOCK_AI=true.
 */
function generateMockResponse(prompt, schema) {
  const year = new Date().getFullYear();

  if (prompt.includes("Original Life Decision:")) {
    // Generate universe mock
    const mock = {
      originalDecision: "What if I had chosen Robotics instead of Web Development?",
      category: "Career",
      universes: [
        {
          id: "real-orig",
          name: "Full-Stack Web Architect",
          type: "original",
          parentRealityId: null,
          parentEventId: null,
          summary: "Remained in software and web systems, scaling high-throughput distributed applications.",
          career: "Principal Software Architect",
          industry: "Cloud & Web Infrastructure",
          location: "San Francisco, CA",
          skills: ["TypeScript", "Distributed Systems", "Cloud Orchestration", "Node.js"],
          opportunities: ["Founding engineer at high-growth unicorn", "Keynote speaker at global summits"],
          challenges: ["Screen fatigue", "Fast-moving framework churn"],
          outcome: "Rapid financial accumulation with deep mastery of large-scale web systems.",
          events: [
            {
              order: 1,
              year: year + 1,
              title: "Senior Engineering Transition",
              description: "Promoted to lead cloud architectures for real-time collaborative web platforms.",
              category: "Career",
              skills: ["Cloud Orchestration"],
              opportunities: ["Leading a team of 10"],
              challenges: ["Legacy codebase refactoring"],
              consequences: "Doubled system throughput.",
            },
            {
              order: 2,
              year: year + 3,
              title: "Founding Architect Role",
              description: "Joined a stealth web-infrastructure venture with substantial equity.",
              category: "Career",
              skills: ["Distributed Systems"],
              opportunities: ["Shaping company tech DNA"],
              challenges: ["Extreme volatility"],
              consequences: "Raised Series A funding.",
            },
            {
              order: 3,
              year: year + 6,
              title: "Global Tech Fellow",
              description: "Authored foundational open-source protocols for decentralized data sync.",
              category: "Personal",
              skills: ["System Design"],
              opportunities: ["Global community impact"],
              challenges: ["Work-life boundaries"],
              consequences: "Recognized as leading industry authority.",
            },
          ],
        },
        {
          id: "real-alt-1",
          name: "The Robotics Path",
          type: "alternative",
          parentRealityId: null,
          parentEventId: null,
          summary: "Pivoted into physical computing and humanoid robotics research in Asia.",
          career: "Autonomous Systems Roboticist",
          industry: "Robotics & Automation",
          location: "Tokyo, Japan",
          skills: ["ROS 2", "Kinematics", "C++", "Sensor Fusion"],
          opportunities: ["Direct fellowship with leading roboticists", "Field deployment of rescue bots"],
          challenges: ["Hardware turnaround cycles", "Language immersion"],
          outcome: "Pioneered adaptive manipulation algorithms with international patents.",
          events: [
            {
              order: 1,
              year: year + 1,
              title: "Mechatronics Fellowship",
              description: "Relocated to Tokyo on an advanced robotics laboratory grant.",
              category: "Relocation",
              skills: ["Kinematics", "ROS 2"],
              opportunities: ["State-of-the-art actuator labs"],
              challenges: ["Intense language study"],
              consequences: "Published benchmark paper on tactile sensors.",
            },
            {
              order: 2,
              year: year + 3,
              title: "Autonomous Walker Deployment",
              description: "Field-tested humanoid mobility algorithms in disaster simulation parks.",
              category: "Career",
              skills: ["Sensor Fusion"],
              opportunities: ["Government agency grants"],
              challenges: ["Hardware failure under rain"],
              consequences: "Secured $2M research spin-off grant.",
            },
            {
              order: 3,
              year: year + 6,
              title: "Director of Biomorphic Robotics",
              description: "Led development of next-generation prosthetic limbs.",
              category: "Career",
              skills: ["Embedded C++"],
              opportunities: ["Global healthcare partnerships"],
              challenges: ["Medical regulatory certification"],
              consequences: "Restored mobility for thousands of patients worldwide.",
            },
          ],
        },
      ],
    };

    if (schema) return schema.parse(mock);
    return mock;
  }

  if (prompt.includes("New Turning Point Question:")) {
    // Branch mock
    const mockBranch = {
      name: "Bio-Hybrid Robotics Explorer",
      type: "alternative",
      summary: "Combined physical robotics with organic neural interfaces, creating bio-mimetic systems.",
      career: "Neural Robotics Specialist",
      industry: "Bio-Engineering",
      location: "Kyoto, Japan",
      skills: ["Neural Interfaces", "Soft Actuators", "Bio-Compatibility"],
      opportunities: ["Breakthrough brain-computer interface trials"],
      challenges: ["Ethical reviews and bio-material degradation"],
      outcome: "A groundbreaking career at the intersection of biology and machinery.",
      events: [
        {
          order: 1,
          year: year + 2,
          title: "Bio-Interface Prototype",
          description: "Synthesized synthetic tissue actuators with micro-controllers.",
          category: "Innovation",
          skills: ["Soft Actuators"],
          opportunities: ["International patent filing"],
          challenges: ["Material longevity"],
          consequences: "Published in Nature Robotics.",
        },
        {
          order: 2,
          year: year + 4,
          title: "Neural Prosthetics Clinic",
          description: "Established experimental clinic for paralyzed patients.",
          category: "Career",
          skills: ["Bio-Compatibility"],
          opportunities: ["Clinical trial expansion"],
          challenges: ["Patient safety protocols"],
          consequences: "Clinical success rate exceeded 92%.",
        },
      ],
    };
    if (schema) return schema.parse(mockBranch);
    return mockBranch;
  }

  if (prompt.includes("Speculative Day Simulation:")) {
    // Simulate day mock
    const mockDay = {
      realityId: "sim-01",
      overview: {
        career: "Autonomous Systems Roboticist",
        location: "Tokyo, Japan",
        lifestyle: "Fast-paced morning hardware sprints followed by contemplative evening tea in Yanaka.",
        happiness: "Fictional 8.6/10",
        highlights: ["First step of the MK-IV bipedal robot", "Lunch at Tsukiji ramen alley", "Late night simulation run"],
      },
      entries: [
        {
          time: "07:15 AM",
          title: "Tokyo Metro Commute",
          description: "Riding the Chiyoda line while sketching joint kinematics in a grid notebook.",
          experience: "Calm anticipation of the day's motor calibration test.",
          important: false,
        },
        {
          time: "09:30 AM",
          title: "MK-IV Physical Calibration",
          description: "Activating compliant actuators on the humanoid test rig. The motors hum into life.",
          experience: "Adrenaline rush when the stabilization loop converges without error.",
          important: true,
        },
        {
          time: "01:00 PM",
          title: "Rooftop Lab Lunch",
          description: "Eating bento with researchers while debating torque vs position control architectures.",
          experience: "Deep sense of community and shared pursuit.",
          important: false,
        },
        {
          time: "04:45 PM",
          title: "Breakthrough Sensor Reading",
          description: "The pressure feedback array detects micro-vibrations across artificial fingertips.",
          experience: "Realizing we just solved the gentle-grip manipulation problem.",
          important: true,
        },
        {
          time: "08:30 PM",
          title: "Evening Walk in Yanaka",
          description: "Quiet lantern-lit streets of old Tokyo, cooling evening air and distant train bells.",
          experience: "Gratitude for choosing this path five years ago.",
          important: false,
        },
      ],
    };
    if (schema) return schema.parse(mockDay);
    return mockDay;
  }

  if (prompt.includes("Compare the following alternate realities")) {
    // Compare mock
    const mockCompare = {
      realities: [
        {
          id: "real-1",
          scores: {
            incomePotential: 9,
            careerGrowth: 8,
            workLifeBalance: 6,
            innovationImpact: 7,
          },
          summary: "High financial velocity with steady corporate advancement.",
        },
        {
          id: "real-2",
          scores: {
            incomePotential: 7,
            careerGrowth: 9,
            workLifeBalance: 5,
            innovationImpact: 10,
          },
          summary: "Frontier scientific prestige with tangible societal legacy.",
        },
      ],
      takeaways: [
        "Path 1 optimizes for near-term wealth and flexibility.",
        "Path 2 demands high sacrifice but delivers profound personal meaning and patent creation.",
        "Both paths demonstrate high resilience against automation.",
      ],
      finalSummary: "Each reality trades peace of mind for distinct forms of mastery. Neither is superior; each represents a different facet of potential fulfilled.",
    };
    if (schema) return schema.parse(mockCompare);
    return mockCompare;
  }

  return {};
}
