import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2).max(100),
  company: z.string().min(1).max(100),
  location: z.string().optional().default("Remote"),
  jobType: z
    .enum([
      "full-time",
      "part-time",
      "contract",
      "freelance",
      "internship",
      "remote",
    ])
    .optional()
    .default("full-time"),
  url: z.url().optional(),
  description: z.string().min(10),
  requirements: z.array(z.string()).optional().default([]),
  salary: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().default("USD"),
    })
    .optional(),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(""),
  source: z.string().optional().default("manual"),
  deadline: z.iso.datetime().optional(),
});

export const updateJobSchema = createJobSchema.partial().extend({
  status: z
    .enum(["saved", "applied", "interview", "offer", "rejected", "withdrawn"])
    .optional(),
  appliedAt: z.iso.datetime().optional(),
});

export const jobQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  status: z
    .enum(["saved", "applied", "interview", "offer", "rejected", "withdrawn"])
    .optional(),
  search: z.string().optional(),
  sort: z.string().optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
export type UpdateJobDto = z.infer<typeof updateJobSchema>;
export type JobQueryDto = z.infer<typeof jobQuerySchema>;
