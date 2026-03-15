import { Router } from "express";
import { requireAuth } from "@middleware/auth";
import { validate } from "@middleware/validate";
import { aiRateLimiter } from "@middleware/rateLimiter";
import { aiController } from "./ai.controller";
import {
  generateEmailSchema,
  generateCVSummarySchema,
} from "@validators/ai.validator";

const router: Router = Router();

router.use(requireAuth);
router.use(aiRateLimiter);

router.post("/generate-email", validate(generateEmailSchema), (req, res) =>
  aiController.generateEmail(req as any, res),
);
router.post(
  "/generate-cv-summary",
  validate(generateCVSummarySchema),
  (req, res) => aiController.generateCVSummary(req as any, res),
);

export default router;
