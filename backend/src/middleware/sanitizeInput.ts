import type { NextFunction, Request, Response } from "express";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const sanitizeObject = (obj: Record<string, unknown>): void => {
  for (const key of Object.keys(obj)) {
    const unsafeKey = key.startsWith("$") || key.includes(".");
    if (unsafeKey) {
      delete obj[key];
      continue;
    }

    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (isPlainObject(item)) sanitizeObject(item);
      });
      continue;
    }

    if (isPlainObject(value)) {
      sanitizeObject(value);
    }
  }
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (isPlainObject(req.body)) sanitizeObject(req.body as Record<string, unknown>);
  if (isPlainObject(req.params)) sanitizeObject(req.params as Record<string, unknown>);
  if (isPlainObject(req.query as unknown)) sanitizeObject(req.query as unknown as Record<string, unknown>);
  next();
};
