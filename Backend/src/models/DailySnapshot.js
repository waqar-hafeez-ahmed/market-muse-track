import mongoose from "mongoose";

const dailySnapshotSchema = new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  asOfDate: Date,
  totalValue: Number,
  currency: String,
});

export default mongoose.model("DailySnapshot", dailySnapshotSchema);
