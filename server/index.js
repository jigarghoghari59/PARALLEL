// server/index.js
import dotenv from "dotenv";
dotenv.config();

console.log(
  "Gemini API Key Loaded:",
  !!process.env.GEMINI_API_KEY
);

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import universeRoutes from "./routes/universeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

// Middleware
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// Rate Limiter per docs/AI_INTEGRATION.md (20 requests per 15 minutes per IP for AI endpoints, relaxed in dev)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests to the multiverse generator. Please take a moment and try again shortly.",
    },
  },
});

app.use("/api/", limiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    timestamp: new Date().toISOString(),
  });
});

// AI Universe Routes
app.use("/api/universe", universeRoutes);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PARALLEL Server listening on http://0.0.0.0:${PORT}`);
});

export default app;
