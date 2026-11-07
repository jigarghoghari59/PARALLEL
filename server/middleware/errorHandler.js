// server/middleware/errorHandler.js
import { ZodError } from "zod";
import { AiError } from "../services/geminiService.js";

export function errorHandler(err, req, res, next) {
  // If response has already started, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues || err.errors || [];
    const formatted = issues
      .map((e) => {
        const path = Array.isArray(e.path) && e.path.length > 0 ? e.path.join(".") : "field";
        return `${path}: ${e.message}`;
      })
      .join("; ");

    return res.status(400).json({
      error: {
        code: "VALIDATION",
        message: formatted || "Invalid input data",
      },
    });
  }

  // 2. Custom Typed AI Errors
  if (err instanceof AiError) {
    return res.status(err.statusCode || 500).json({
      error: {
        code: err.code || "AI_UNAVAILABLE",
        message: err.message || "An AI generation error occurred",
      },
    });
  }

  // 3. Syntax error in body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: {
        code: "VALIDATION",
        message: "Invalid JSON payload in request body",
      },
    });
  }

  // 4. Fallback Generic Error
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "An unexpected server error occurred",
    },
  });
}
