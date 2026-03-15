import { Router } from "express";
import { requireAuth } from "@middleware/auth";
import { authController } from "./auth.controller";

const router: Router = Router();

router.post("/sync", requireAuth, (req, res) =>
  authController.syncUser(req as any, res),
);
router.get("/me", requireAuth, (req, res) =>
  authController.getMe(req as any, res),
);

export default router;
