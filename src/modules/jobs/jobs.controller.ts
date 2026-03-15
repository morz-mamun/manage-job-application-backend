import { Response } from "express";
import { AuthenticatedRequest } from "@/types";
import { jobsService } from "./jobs.service";
import { sendSuccess, sendCreated, sendNotFound } from "@utils/apiResponse";
import {
  CreateJobDto,
  UpdateJobDto,
  JobQueryDto,
} from "@validators/job.validator";

export class JobsController {
  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const job = await jobsService.createJob(
      req.auth.userId,
      req.body as CreateJobDto,
    );
    return sendCreated(res, "Job saved successfully", job);
  }

  async getAll(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { jobs, meta } = await jobsService.getJobs(
      req.auth.userId,
      req.query as unknown as JobQueryDto,
    );
    return sendSuccess(res, "Jobs fetched successfully", jobs, 200, meta);
  }

  async getOne(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const job = await jobsService.getJobById(
      req.auth.userId,
      req.params.id as string,
    );
    if (!job) return sendNotFound(res, "Job");
    return sendSuccess(res, "Job fetched successfully", job);
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const job = await jobsService.updateJob(
      req.auth.userId,
      req.params.id as string,
      req.body as UpdateJobDto,
    );
    return sendSuccess(res, "Job updated successfully", job);
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    await jobsService.deleteJob(req.auth.userId, req.params.id as string);
    return sendSuccess(res, "Job deleted successfully");
  }

  async getStats(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const stats = await jobsService.getStats(req.auth.userId);
    return sendSuccess(res, "Stats fetched successfully", stats);
  }
}

export const jobsController = new JobsController();
