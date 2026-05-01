import { ApiError } from "../../utils/ApiError";
import { toObjectId } from "../../utils/ownershipCheck";
import { InvoiceCounterModel } from "./invoiceCounter.model";
import { InvoiceModel } from "./invoice.model";

const nextInvoiceNumber = async (userId: string): Promise<number> => {
  const counter = await InvoiceCounterModel.findByIdAndUpdate(
    toObjectId(userId),
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
};

export const createInvoice = async (userId: string, payload: Record<string, unknown>) => {
  const invoiceNumber = await nextInvoiceNumber(userId);
  return InvoiceModel.create({
    ...payload,
    userId: toObjectId(userId),
    invoiceNumber
  });
};

export const listInvoices = async (
  userId: string,
  page: number,
  limit: number,
  status?: string,
  includeDeleted = false
) => {
  const query: Record<string, unknown> = { userId: toObjectId(userId) };
  query.isDeleted = includeDeleted ? true : false;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    InvoiceModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    InvoiceModel.countDocuments(query)
  ]);

  return {
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 }
  };
};

export const getOwnedInvoice = async (userId: string, invoiceId: string) => {
  const invoice = await InvoiceModel.findOne({
    _id: toObjectId(invoiceId),
    userId: toObjectId(userId),
    isDeleted: false
  });
  if (!invoice) throw new ApiError(404, "NOT_FOUND", "Invoice not found");
  return invoice;
};

export const updateOwnedInvoice = async (
  userId: string,
  invoiceId: string,
  payload: Record<string, unknown>
) => {
  const invoice = await getOwnedInvoice(userId, invoiceId);
  Object.assign(invoice, payload);
  await invoice.save();
  return invoice;
};

export const updateInvoiceStatus = async (
  userId: string,
  invoiceId: string,
  status: "draft" | "published" | "archived"
) => {
  return updateOwnedInvoice(userId, invoiceId, { status });
};

export const softDeleteInvoice = async (userId: string, invoiceId: string) => {
  return updateOwnedInvoice(userId, invoiceId, { isDeleted: true, deletedAt: new Date() });
};

export const restoreInvoice = async (userId: string, invoiceId: string) => {
  return updateOwnedInvoice(userId, invoiceId, { isDeleted: false, deletedAt: null });
};
