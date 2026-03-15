import { Router } from "express";
import { requireAuth } from "@middleware/auth";
import { validate } from "@middleware/validate";
import { cvController } from "./cv.controller";
import { updateCVSchema } from "@validators/cv.validator";

const router: Router = Router();

router.use(requireAuth);

router.get("/", (req, res) => cvController.getCV(req as any, res));
router.patch("/", validate(updateCVSchema), (req, res) =>
  cvController.updateCV(req as any, res),
);

export default router;
