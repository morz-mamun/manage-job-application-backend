import { Response } from "express";
import { AuthenticatedRequest } from "@/types";
import { cvService } from "./cv.service";
import { sendSuccess } from "@utils/apiResponse";
import { UpdateCVDto } from "@validators/cv.validator";

export class CVController {
  async getCV(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const cv = await cvService.getCV(req.auth.userId);
    return sendSuccess(res, "CV fetched successfully", cv);
  }

  async updateCV(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const cv = await cvService.updateCV(
      req.auth.userId,
      req.body as UpdateCVDto,
    );
    return sendSuccess(res, "CV updated successfully", cv);
  }
}

export const cvController = new CVController();
