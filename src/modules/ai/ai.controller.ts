import { Response } from "express";
import { AuthenticatedRequest } from "@/types";
import { aiService } from "./ai.service";
import { sendSuccess } from "@utils/apiResponse";
import {
  GenerateEmailDto,
  GenerateCVSummaryDto,
} from "@validators/ai.validator";

export class AIController {
  async generateEmail(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const result = await aiService.generateEmail(
      req.auth.userId,
      req.body as GenerateEmailDto,
    );
    return sendSuccess(res, "Email generated successfully", { email: result });
  }

  async generateCVSummary(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const result = await aiService.generateCVSummary(
      req.auth.userId,
      req.body as GenerateCVSummaryDto,
    );
    return sendSuccess(res, "CV summary generated successfully", {
      summary: result,
    });
  }
}

export const aiController = new AIController();
