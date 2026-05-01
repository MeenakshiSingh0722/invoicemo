import type { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { loginUser, logoutByRefreshToken, refreshSession, registerUser } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax",
  path: "/api/v1/auth"
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const { user, accessToken, refreshToken } = await registerUser(email, password);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return sendSuccess(
    res,
    { accessToken, user: { id: user.id, email: user.email, isVerified: user.isVerified } },
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const { user, accessToken, refreshToken } = await loginUser(email, password);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return sendSuccess(res, { accessToken, user: { id: user.id, email: user.email } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    throw new ApiError(401, "REFRESH_TOKEN_INVALID", "Refresh token missing");
  }
  const { accessToken, refreshToken } = await refreshSession(token);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return sendSuccess(res, { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    await logoutByRefreshToken(token);
  }
  res.clearCookie("refreshToken", cookieOptions);
  return sendSuccess(res, { loggedOut: true });
});

export const forgotPassword = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, { message: "If the email exists, a reset link will be sent." });
});

export const resetPassword = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, { passwordReset: true });
});

export const verifyEmail = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, { verified: true });
});
