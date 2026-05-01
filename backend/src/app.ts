import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { sanitizeInput } from "./middleware/sanitizeInput";
import { apiRouter } from "./routes";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeInput);

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => res.status(200).json({ success: true, data: { status: "ok" } }));
app.get("/ready", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  return res.status(ready ? 200 : 503).json({
    success: ready,
    data: { status: ready ? "ready" : "not_ready" }
  });
});

const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/v1", globalLimiter);

const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  skipSuccessfulRequests: true
});
app.use("/api/v1/auth", authLimiter);

app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
