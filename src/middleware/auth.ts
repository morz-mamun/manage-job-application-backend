import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { sendUnauthorized } from "@utils/apiResponse";
import { AuthenticatedRequest } from "@/types";

// Require authentication - use after clerkAuth
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const auth = getAuth(req);

  if (!auth.userId) {
    sendUnauthorized(res, "Authentication required");
    return;
  }

  // Attach auth to request
  (req as AuthenticatedRequest).auth = {
    userId: auth.userId,
    sessionId: auth.sessionId!,
  };

  next();
};
