// server/middleware/crisisCheck.js

const CRISIS_PATTERNS = [
  /\b(?:kill|end)\s+my(?:self| life)\b/i,
  /\b(?:suicide|suicidal)\b/i,
  /\b(?:want to|thinking of|planning to)\s+die\b/i,
  /\b(?:self[- ]harm|hurt\s+myself|cutting\s+myself)\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bgive\s+up\s+on\s+life\b/i,
];

export function checkCrisisText(text) {
  if (!text || typeof text !== "string") return false;
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export function crisisCheckMiddleware(req, res, next) {
  const textToCheck =
    req.body?.originalDecision ||
    req.body?.question ||
    req.body?.decision ||
    "";

  if (checkCrisisText(textToCheck)) {
    return res.status(200).json({
      crisis: true,
      message:
        "It sounds like you may be going through a difficult time. PARALLEL is a speculative storytelling tool, but your life and wellbeing matter deeply. If you or someone you know is in distress or having thoughts of self-harm, please reach out for compassionate support. In the US call or text 988, in the UK call 111, in India call 9152987821 (Vandrevala Foundation), or connect with a local crisis center or mental health professional.",
    });
  }

  next();
}
