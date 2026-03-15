import { JobStatus, JobType } from "@/types";
import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  userId: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  status: JobStatus;
  url?: string;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  tags: string[];
  notes: string;
  source: string;
  deadline?: Date;
  appliedAt?: Date;
  generatedEmail?: string;
  generatedCVSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "Remote", trim: true },
    jobType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "freelance",
        "internship",
        "remote",
      ],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["saved", "applied", "interview", "offer", "rejected", "withdrawn"],
      default: "saved",
      index: true,
    },
    url: { type: String, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" },
    },
    tags: [{ type: String }],
    notes: { type: String, default: "" },
    source: { type: String, default: "manual", trim: true },
    deadline: { type: Date },
    appliedAt: { type: Date },
    generatedEmail: { type: String },
    generatedCVSummary: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound index for efficient user-specific queries
JobSchema.index({ userId: 1, status: 1 });
JobSchema.index({ userId: 1, createdAt: -1 });

export const Job = mongoose.model<IJob>("Job", JobSchema);
