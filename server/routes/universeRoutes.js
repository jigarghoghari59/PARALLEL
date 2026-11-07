// server/routes/universeRoutes.js
import { Router } from "express";
import {
  generateUniverse,
  branchUniverse,
  simulateDay,
  compareRealities,
} from "../controllers/universeController.js";
import { crisisCheckMiddleware } from "../middleware/crisisCheck.js";

const router = Router();

// Apply crisis check before generation/branching
router.post("/generate", crisisCheckMiddleware, generateUniverse);
router.post("/branch", crisisCheckMiddleware, branchUniverse);
router.post("/simulate-day", simulateDay);
router.post("/compare", compareRealities);

export default router;
