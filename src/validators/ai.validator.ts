import { z } from "zod";

export const generateEmailSchema = z.object({
  jobId: z.string().optional(),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  tone: z
    .enum(["professional", "enthusiastic", "concise"])
    .optional()
    .default("professional"),
  additionalContext: z.string().optional(),
});

export const generateCVSummarySchema = z.object({
  jobId: z.string().optional(),
  jobDescription: z.string().min(50),
});

export type GenerateEmailDto = z.infer<typeof generateEmailSchema>;
export type GenerateCVSummaryDto = z.infer<typeof generateCVSummarySchema>;
