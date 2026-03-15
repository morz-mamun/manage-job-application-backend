import { GoogleGenAI } from "@google/genai";
import { env } from "@config/env";
import { User } from "@models/User";
import { Job } from "@models/Job";
import { NotFoundError } from "@utils/AppError";
import {
  GenerateEmailDto,
  GenerateCVSummaryDto,
} from "@validators/ai.validator";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

export class AIService {
  async generateEmail(userId: string, dto: GenerateEmailDto): Promise<string> {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new NotFoundError("User profile");

    // Build CV context
    const cvContext = this.buildCVContext(user.cv);

    const prompt = `You are a professional job application email writer.

CANDIDATE PROFILE:
${cvContext}

JOB DESCRIPTION:
${dto.jobDescription}

${dto.additionalContext ? `ADDITIONAL CONTEXT:\n${dto.additionalContext}\n` : ""}

Write a ${dto.tone} job application email tailored to this specific job. 
The email should:
- Have a compelling subject line
- Be personalized to the job requirements
- Highlight the most relevant skills from the candidate's profile
- Be concise (under 350 words for the body)
- Have a clear call-to-action
- Sound human and genuine, not like a template

Format your response as:
SUBJECT: [email subject]
---
[email body]`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text ?? "";

    // Save to job if jobId provided
    if (dto.jobId) {
      await Job.findByIdAndUpdate(dto.jobId, { generatedEmail: text });
    }

    return text;
  }

  async generateCVSummary(
    userId: string,
    dto: GenerateCVSummaryDto,
  ): Promise<string> {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new NotFoundError("User profile");

    const cvContext = this.buildCVContext(user.cv);

    const prompt = `You are an expert resume writer and ATS optimization specialist.

CANDIDATE'S CURRENT CV:
${cvContext}

TARGET JOB DESCRIPTION:
${dto.jobDescription}

Create a tailored professional summary (3-4 sentences) and identify the top 5 most relevant skills to highlight for this specific job. 
Also suggest any key achievements or experiences from the CV to emphasize.

Format:
TAILORED SUMMARY:
[summary]

TOP SKILLS TO HIGHLIGHT:
- [skill 1]
- [skill 2]
- [skill 3]
- [skill 4]
- [skill 5]

KEY EXPERIENCES TO EMPHASIZE:
[bullet points]`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text ?? "";

    if (dto.jobId) {
      await Job.findByIdAndUpdate(dto.jobId, { generatedCVSummary: text });
    }

    return text;
  }

  private buildCVContext(cv: any): string {
    const lines: string[] = [];

    if (cv.title) lines.push(`Title: ${cv.title}`);
    if (cv.summary) lines.push(`Summary: ${cv.summary}`);
    if (cv.skills?.length) lines.push(`Skills: ${cv.skills.join(", ")}`);

    if (cv.experiences?.length) {
      lines.push("\nExperience:");
      cv.experiences.forEach((exp: any) => {
        lines.push(`- ${exp.position} at ${exp.company}`);
        lines.push(`  ${exp.description}`);
        if (exp.technologies?.length) {
          lines.push(`  Technologies: ${exp.technologies.join(", ")}`);
        }
      });
    }

    if (cv.education?.length) {
      lines.push("\nEducation:");
      cv.education.forEach((edu: any) => {
        lines.push(`- ${edu.degree} in ${edu.field} from ${edu.institution}`);
      });
    }

    if (cv.projects?.length) {
      lines.push("\nProjects:");
      cv.projects.forEach((proj: any) => {
        lines.push(`- ${proj.name}: ${proj.description}`);
      });
    }

    return lines.join("\n");
  }
}

export const aiService = new AIService();
