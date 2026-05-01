import { Router } from "express";
import { validate } from "../../middleware/validate";
import { forgotPassword, login, logout, refresh, register, resetPassword, verifyEmail } from "./auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailParamSchema
} from "./auth.schema";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshSchema), refresh);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password", validate(resetPasswordSchema), resetPassword);
authRouter.get("/verify-email/:token", validate(verifyEmailParamSchema), verifyEmail);
