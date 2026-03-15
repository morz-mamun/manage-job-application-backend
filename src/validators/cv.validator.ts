import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10),
  technologies: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  current: z.boolean().default(false),
});

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  technologies: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
});

export const updateCVSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  languages: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

export type UpdateCVDto = z.infer<typeof updateCVSchema>;
