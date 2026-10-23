import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeRequired: {
    type: Number,
    required: true,
  },
  batchNumber: {
    type: Number,
  },
  amountRequired: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "Ongoing", "Completed"],
    default: "Not Started",
  },
  filesURL: {
    type: String,
  },
});

const champaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amountRequired: {
      type: Number,
      required: true,
    },
    equity: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
    },
    amountGained: {
      type: Number,
      default: 0,
    },
    bufferAmountGained: {
      type: Number,
      default: 0,
    },
    investors: {
      type: [
        {
          investorID: String,
          equity: Number,
          invested: Number,
          isBuffer:{
            type:Boolean,
            default:false
          }
        },
      ],
    },
    userRef: {
      type: String,
      required: true,
    },
    filesURL: {
      type: String,
    },
    batches: {
      type: [batchSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Champaign = mongoose.model("champaign", champaignSchema);
export default Champaign;
