import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { sendSuccess } from "../../utils/response";

export const templateRouter = Router();

templateRouter.get("/", requireAuth, (_req, res) => {
  return sendSuccess(res, [
    { id: "classic", name: "Classic Blue", tier: "free" },
    { id: "modern", name: "Modern Minimal", tier: "pro" },
    { id: "clean", name: "Clean Serif", tier: "free" }
  ]);
});
