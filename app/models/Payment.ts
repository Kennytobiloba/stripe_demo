import mongoose, { Schema, Document, models } from "mongoose";

export interface IPayment extends Document {
  userId?: string;
  email?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentIntentId?: string;
  subscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: String },
    email: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paymentIntentId: { type: String },
    subscriptionId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in Next.js
const Payment = models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
