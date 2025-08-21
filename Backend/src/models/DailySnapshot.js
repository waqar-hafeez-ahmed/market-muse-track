import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    date: { type: Date, default: Date.now }, // auto add timestamp
    totalValue: { type: Number, required: true }, // portfolio value in USD
  },
  { timestamps: true }
);

// Ensure only 1 snapshot per day per portfolio
snapshotSchema.index({ portfolioId: 1, date: 1 }, { unique: true });

export default mongoose.model("Snapshot", snapshotSchema);
