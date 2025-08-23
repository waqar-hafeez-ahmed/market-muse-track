import mongoose from "mongoose";

const priceCacheSchema = new mongoose.Schema(
  {
    symbol: String, // e.g. BTC/USD, AAPL
    source: { type: String, enum: ["coingecko", "twelvedata"] },
    price: Number,
    previousClose: Number,
    change24h: Number,
    currency: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("PriceCache", priceCacheSchema);
