import { Router } from "express";
import { requireAuth } from "@middleware/auth";
import { validate } from "@middleware/validate";
import { jobsController } from "./jobs.controller";
import {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
} from "@validators/job.validator";

const router: Router = Router();

// All routes require authentication
router.use(requireAuth);

router.get("/stats", (req, res) => jobsController.getStats(req as any, res));
router.get("/", validate(jobQuerySchema, "query"), (req, res) =>
  jobsController.getAll(req as any, res),
);
router.post("/", validate(createJobSchema), (req, res) =>
  jobsController.create(req as any, res),
);
router.get("/:id", (req, res) => jobsController.getOne(req as any, res));
router.patch("/:id", validate(updateJobSchema), (req, res) =>
  jobsController.update(req as any, res),
);
router.delete("/:id", (req, res) => jobsController.delete(req as any, res));

export default router;
