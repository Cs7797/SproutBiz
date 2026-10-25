import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    investorId: {
      type: String,
      required: true,
      index: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "champaign",
      required: true,
      index: true,
    },
    investedCents: { type: Number, required: true, min: 1 },
    tipCents: { type: Number, required: true, min: 0, default: 0 },
    campaignAmountRequired: { type: Number, required: true, min: 1 },
    campaignEquity: { type: Number, required: true, min: 0 },
    equity: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ["usd"] },
    isBuffer: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["creating", "pending", "finalized", "failed"],
      default: "creating",
      index: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("payment", paymentSchema);
export default Payment;
