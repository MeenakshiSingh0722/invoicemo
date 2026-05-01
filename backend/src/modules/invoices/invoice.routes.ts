import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import {
  createInvoiceHandler,
  deleteInvoiceHandler,
  downloadInvoiceHandler,
  getInvoiceHandler,
  listInvoicesHandler,
  restoreInvoiceHandler,
  updateInvoiceHandler,
  updateStatusHandler
} from "./invoice.controller";
import {
  createInvoiceSchema,
  invoiceIdParamSchema,
  listInvoiceSchema,
  statusSchema,
  updateInvoiceSchema
} from "./invoice.schema";

export const invoiceRouter = Router();

invoiceRouter.use(requireAuth);

invoiceRouter.get("/", validate(listInvoiceSchema), listInvoicesHandler);
invoiceRouter.post("/", validate(createInvoiceSchema), createInvoiceHandler);
invoiceRouter.get("/:id", validate(invoiceIdParamSchema), getInvoiceHandler);
invoiceRouter.put("/:id", validate(invoiceIdParamSchema.merge(updateInvoiceSchema)), updateInvoiceHandler);
invoiceRouter.patch("/:id/status", validate(invoiceIdParamSchema.merge(statusSchema)), updateStatusHandler);
invoiceRouter.delete("/:id", validate(invoiceIdParamSchema), deleteInvoiceHandler);
invoiceRouter.post("/:id/restore", validate(invoiceIdParamSchema), restoreInvoiceHandler);
invoiceRouter.get("/:id/download", validate(invoiceIdParamSchema), downloadInvoiceHandler);
