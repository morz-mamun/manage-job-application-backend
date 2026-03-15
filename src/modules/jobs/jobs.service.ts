import { Job, IJob } from "@models/Job";
import { NotFoundError, ForbiddenError } from "@utils/AppError";
import { buildPaginationMeta } from "@utils/apiResponse";
import {
  CreateJobDto,
  UpdateJobDto,
  JobQueryDto,
} from "@validators/job.validator";

export class JobsService {
  async createJob(userId: string, dto: CreateJobDto): Promise<IJob> {
    const job = await Job.create({ userId, ...dto });
    return job;
  }

  async getJobs(userId: string, query: JobQueryDto) {
    const { page, limit, status, search, sort, order } = query;

    const filter: Record<string, unknown> = { userId };

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === "asc" ? 1 : -1,
    };
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);

    return {
      jobs,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getJobById(userId: string, jobId: string): Promise<IJob> {
    const job = await Job.findById(jobId);

    if (!job) throw new NotFoundError("Job");
    if (job.userId !== userId) throw new ForbiddenError();

    return job;
  }

  async updateJob(
    userId: string,
    jobId: string,
    dto: UpdateJobDto,
  ): Promise<IJob> {
    const job = await Job.findById(jobId);

    if (!job) throw new NotFoundError("Job");
    if (job.userId !== userId) throw new ForbiddenError();

    // Auto-set appliedAt when status changes to applied
    if (dto.status === "applied" && !job.appliedAt) {
      dto.appliedAt = new Date().toISOString();
    }

    Object.assign(job, dto);
    await job.save();

    return job;
  }

  async deleteJob(userId: string, jobId: string): Promise<void> {
    const job = await Job.findById(jobId);

    if (!job) throw new NotFoundError("Job");
    if (job.userId !== userId) throw new ForbiddenError();

    await job.deleteOne();
  }

  async getStats(userId: string) {
    const stats = await Job.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    };

    stats.forEach(({ _id, count }) => {
      result[_id as keyof typeof result] = count;
      result.total += count;
    });

    return result;
  }
}

export const jobsService = new JobsService();
