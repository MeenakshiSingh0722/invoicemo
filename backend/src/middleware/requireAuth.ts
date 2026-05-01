import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "UNAUTHORIZED", "Missing access token");
  }

  const token = authHeader.replace("Bearer ", "");
  req.user = verifyAccessToken(token);
  next();
};
