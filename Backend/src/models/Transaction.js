import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
    assetType: {
      type: String,
      enum: ["stock", "crypto", "forex", "commodity"],
    },
    symbol: String,
    cgId: String,
    action: {
      type: String,
      enum: ["BUY", "SELL", "DIVIDEND", "DEPOSIT", "WITHDRAW"],
    },
    quantity: Number,
    price: Number,
    fee: Number,
    executedAt: Date,
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
