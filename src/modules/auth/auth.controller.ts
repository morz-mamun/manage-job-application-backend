import { Response } from "express";
import { AuthenticatedRequest } from "@/types";
import { authService } from "./auth.service";
import { sendSuccess, sendNotFound } from "@utils/apiResponse";

export class AuthController {
  // Called after Clerk login to sync user to DB
  async syncUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { userId } = req.auth;
    const { email, firstName, lastName } = req.body;

    const user = await authService.syncUser({
      clerkId: userId,
      email,
      firstName,
      lastName,
    });
    return sendSuccess(res, "User synced successfully", user);
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user = await authService.getMe(req.auth.userId);
    if (!user) return sendNotFound(res, "User");
    return sendSuccess(res, "Profile fetched successfully", user);
  }
}

export const authController = new AuthController();
