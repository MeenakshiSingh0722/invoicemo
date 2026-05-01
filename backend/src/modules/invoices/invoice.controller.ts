import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendPaginated, sendSuccess } from "../../utils/response";
import {
  createInvoice,
  getOwnedInvoice,
  listInvoices,
  restoreInvoice,
  softDeleteInvoice,
  updateInvoiceStatus,
  updateOwnedInvoice
} from "./invoice.service";

export const createInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await createInvoice(req.user!.sub, req.body as Record<string, unknown>);
  return sendSuccess(res, invoice, 201);
});

export const listInvoicesHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const status = (req.query.status as string | undefined) ?? undefined;
  const includeDeleted = String(req.query.includeDeleted ?? "false") === "true";
  const result = await listInvoices(req.user!.sub, page, limit, status, includeDeleted);
  return sendPaginated(res, result.data, result.pagination);
});

export const getInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await getOwnedInvoice(req.user!.sub, String(req.params.id));
  return sendSuccess(res, invoice);
});

export const updateInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await updateOwnedInvoice(
    req.user!.sub,
    String(req.params.id),
    req.body as Record<string, unknown>
  );
  return sendSuccess(res, invoice);
});

export const updateStatusHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await updateInvoiceStatus(req.user!.sub, String(req.params.id), req.body.status);
  return sendSuccess(res, invoice);
});

export const deleteInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await softDeleteInvoice(req.user!.sub, String(req.params.id));
  return sendSuccess(res, invoice);
});

export const restoreInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await restoreInvoice(req.user!.sub, String(req.params.id));
  return sendSuccess(res, invoice);
});

export const downloadInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await getOwnedInvoice(req.user!.sub, String(req.params.id));
  return sendSuccess(res, {
    id: invoice.id,
    downloadUrl: `/api/v1/invoices/${invoice.id}/download`,
    message: "PDF generation pipeline placeholder"
  });
});
