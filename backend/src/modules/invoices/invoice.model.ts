import { Schema, model, type Types } from "mongoose";

type LineItem = {
  description: string;
  qty: number;
  rate: number;
  amount: number;
};

type Signature = {
  type: "font" | "canvas";
  value: string;
};

export type InvoiceDoc = {
  userId: Types.ObjectId;
  invoiceNumber: number;
  status: "draft" | "published" | "archived";
  template: string;
  fontFamily: string;
  colorScheme: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  signature?: Signature;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const invoiceSchema = new Schema<InvoiceDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    invoiceNumber: { type: Number, required: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    template: { type: String, required: true },
    fontFamily: { type: String, required: true },
    colorScheme: { type: String, required: true },
    lineItems: [
      {
        description: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    signature: {
      type: {
        type: String,
        enum: ["font", "canvas"]
      },
      value: { type: String }
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

invoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ userId: 1, status: 1, createdAt: -1 });
invoiceSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 2_592_000, partialFilterExpression: { isDeleted: true } });

export const InvoiceModel = model<InvoiceDoc>("Invoice", invoiceSchema);
