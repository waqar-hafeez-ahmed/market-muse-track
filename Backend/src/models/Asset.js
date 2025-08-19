import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetType: String,
  symbol: String,
  exchange: String,
  currency: String,
  cgId: String,
  yfinanceSymbol: String,
  lastResolvedAt: Date,
});

export default mongoose.model("Asset", assetSchema);
