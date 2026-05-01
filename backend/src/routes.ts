import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { invoiceRouter } from "./modules/invoices/invoice.routes";
import { templateRouter } from "./modules/templates/template.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/invoices", invoiceRouter);
apiRouter.use("/templates", templateRouter);
