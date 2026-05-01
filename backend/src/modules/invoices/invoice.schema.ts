import { z } from "zod";

const lineItem = z.object({
  description: z.string().min(1),
  qty: z.number().positive(),
  rate: z.number().nonnegative(),
  amount: z.number().nonnegative()
});

export const createInvoiceSchema = z.object({
  body: z.object({
    template: z.string().min(1),
    fontFamily: z.string().min(1),
    colorScheme: z.string().min(1),
    lineItems: z.array(lineItem).min(1),
    subtotal: z.number().nonnegative(),
    taxRate: z.number().nonnegative(),
    taxAmount: z.number().nonnegative(),
    total: z.number().nonnegative(),
    currency: z.string().length(3),
    signature: z
      .object({
        type: z.enum(["font", "canvas"]),
        value: z.string().min(1)
      })
      .optional()
  })
});

export const updateInvoiceSchema = z.object({
  body: createInvoiceSchema.shape.body.partial()
});

export const invoiceIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const statusSchema = z.object({
  body: z.object({
    status: z.enum(["draft", "published", "archived"])
  })
});

export const listInvoiceSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    status: z.enum(["draft", "published", "archived"]).optional(),
    includeDeleted: z.coerce.boolean().optional()
  })
});
