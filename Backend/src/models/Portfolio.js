import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    name: String,
    note: String,
    baseCurrency: { type: String, default: "USD" },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
