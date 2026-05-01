import { Schema, model, type Types } from "mongoose";

type InvoiceCounterDoc = {
  _id: Types.ObjectId;
  seq: number;
};

const invoiceCounterSchema = new Schema<InvoiceCounterDoc>({
  _id: { type: Schema.Types.ObjectId, required: true },
  seq: { type: Number, default: 0 }
});

export const InvoiceCounterModel = model<InvoiceCounterDoc>("InvoiceCounter", invoiceCounterSchema);
