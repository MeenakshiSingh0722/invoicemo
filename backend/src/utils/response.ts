import type { Response } from "express";

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: { total: number; page: number; limit: number; totalPages: number }
): Response => {
  return res.status(200).json({ success: true, data, pagination });
};
