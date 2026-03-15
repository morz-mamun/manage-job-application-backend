import mongoose, { Document, Schema } from "mongoose";
import { CVEducation, CVExperience, CVProject } from "@/types";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  cv: {
    title: string;
    summary: string;
    skills: string[];
    experiences: CVExperience[];
    education: CVEducation[];
    projects: CVProject[];
    languages: string[];
    certifications: string[];
    updatedAt: Date;
  };
  preferences: {
    jobTypes: string[];
    preferredLocations: string[];
    expectedSalary: {
      min?: number;
      max?: number;
      currency: string;
    };
    remoteOnly: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CVExperienceSchema = new Schema<CVExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  technologies: [{ type: String }],
});

const CVEducationSchema = new Schema<CVEducation>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
});

const CVProjectSchema = new Schema<CVProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  url: { type: String },
  github: { type: String },
});

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    cv: {
      title: { type: String, default: "" },
      summary: { type: String, default: "" },
      skills: [{ type: String }],
      experiences: [CVExperienceSchema],
      education: [CVEducationSchema],
      projects: [CVProjectSchema],
      languages: [{ type: String }],
      certifications: [{ type: String }],
      updatedAt: { type: Date, default: Date.now },
    },
    preferences: {
      jobTypes: [{ type: String }],
      preferredLocations: [{ type: String }],
      expectedSalary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: "USD" },
      },
      remoteOnly: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
