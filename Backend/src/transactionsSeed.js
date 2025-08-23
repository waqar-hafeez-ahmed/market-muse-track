// src/transactionSeed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Transaction from "./models/Transaction.js";

dotenv.config();

// ✅ Fixed portfolio IDs (must match seed.js)
const PORTFOLIOS = {
  growth: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c81f"),
  conservative: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c820"),
  tech: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c821"),
  dividend: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c822"),
  speculative: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c823"),
};

// ✅ Transactions dataset
const investments = [
  { name: "Nvidia", symbol: "NVDA", quantity: 38.00561, price: 141.8585309 },
  { name: "Meta", symbol: "META", quantity: 7.07912, price: 368.2986021 },
  { name: "Quantum ETF", symbol: "QTUM", quantity: 53, price: 93.98 },
  { name: "Google", symbol: "GOOG", quantity: 24.92907, price: 121.1545397 },
  { name: "Microsoft", symbol: "MSFT", quantity: 6, price: 512.885 },
  { name: "Tesla", symbol: "TSLA", quantity: 10, price: 316.28 },
  { name: "IBM", symbol: "IBM", quantity: 12, price: 259.8641667 },
  { name: "Amazon", symbol: "AMZN", quantity: 14, price: 181.45 },
  {
    name: "Automation Tech Robotics ETF",
    symbol: "ARKQ",
    quantity: 25,
    price: 97.6444,
  },
  { name: "Apple", symbol: "AAPL", quantity: 11.88519, price: 139.5122838 },
  { name: "Broadcom", symbol: "AVGO", quantity: 8, price: 288.21 },
  { name: "Rigetti", symbol: "RGTI", quantity: 130, price: 14.45653846 },
  { name: "Palantir", symbol: "PLTR", quantity: 12, price: 158.1833333 },
  { name: "Block XYZ", symbol: "ZYX", quantity: 26, price: 77.78923077 },
  { name: "Taiwan Semiconductor", symbol: "TSM", quantity: 8, price: 242.9525 },
  { name: "AMD", symbol: "AMD", quantity: 10, price: 179.03 },
  { name: "IONQ", symbol: "IONQ", quantity: 40, price: 40.212 },
  { name: "SPDR Gold", symbol: "GLD", quantity: 5, price: 303.012 },
  { name: "Coinbase", symbol: "COIN", quantity: 5, price: 303.526 },
  { name: "Coreweave", symbol: "CRVW", quantity: 11, price: 105.1263636 },
  {
    name: "Quantum Computing",
    symbol: "QUBT",
    quantity: 65,
    price: 15.25507692,
  },
  { name: "D Wave Quantum", symbol: "QBTS", quantity: 56, price: 17.88982143 },
  { name: "C3 Ai", symbol: "AI", quantity: 30, price: 24.49333333 },
  { name: "UiPath", symbol: "PATH", quantity: 50, price: 12.02 },
  { name: "Trump Media", symbol: "DJT", quantity: 30, price: 17.73766667 },
  { name: "Snowflake Inc", symbol: "SNOW", quantity: 2, price: 220.62 },
  { name: "Arqit Quantum", symbol: "ARQQ", quantity: 10, price: 34.178 },
];

// ✅ Distribute investments across 5 portfolios
const portfolioOrder = [
  PORTFOLIOS.growth,
  PORTFOLIOS.conservative,
  PORTFOLIOS.tech,
  PORTFOLIOS.dividend,
  PORTFOLIOS.speculative,
];

const transactions = investments.map((inv, idx) => {
  const portfolioId = portfolioOrder[idx % portfolioOrder.length];
  return {
    portfolioId,
    assetType: "stock",
    symbol: inv.symbol,
    action: "BUY",
    quantity: inv.quantity,
    price: inv.price,
    fee: 0,
    executedAt: new Date(),
    note: `Seeded ${inv.name} for portfolio ${portfolioId.toString()}`,
  };
});

const seedTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    console.log(`✅ ${transactions.length} transactions seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding transactions:", error);
    process.exit(1);
  }
};

seedTransactions();
