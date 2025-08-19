// test.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import Portfolio from "./src/models/Portfolio.js";
import Asset from "./src/models/Asset.js";
import Transaction from "./src/models/Transaction.js";
import DailySnapshot from "./src/models/DailySnapshot.js";
import PriceCache from "./src/models/PriceCache.js";

dotenv.config();

async function testDB() {
  try {
    // 1. Connect
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    // 2. Create a sample Portfolio
    const portfolio = await Portfolio.create({
      name: "My Test Portfolio",
      note: "Testing DB setup",
      baseCurrency: "USD",
    });
    console.log("📂 Portfolio created:", portfolio);

    // 3. Create a sample Asset
    const asset = await Asset.create({
      assetType: "crypto",
      symbol: "BTC",
      currency: "USD",
      cgId: "bitcoin",
      exchange: "Coinbase",
      yfinanceSymbol: "BTC-USD",
    });
    console.log("💰 Asset created:", asset);

    // 4. Create a Transaction
    const tx = await Transaction.create({
      portfolioId: portfolio._id,
      assetType: "crypto",
      symbol: "BTC",
      cgId: "bitcoin",
      action: "BUY",
      quantity: 0.01,
      price: 65000,
      fee: 2,
      executedAt: new Date(),
    });
    console.log("📑 Transaction created:", tx);

    // 5. Add Price Cache
    const price = await PriceCache.create({
      symbol: "BTC-USD",
      source: "coingecko",
      price: 65200,
      currency: "USD",
    });
    console.log("📊 Price cached:", price);

    // 6. Snapshot
    const snapshot = await DailySnapshot.create({
      portfolioId: portfolio._id,
      asOfDate: new Date(),
      totalValue: 652,
      currency: "USD",
    });
    console.log("📸 Snapshot created:", snapshot);

    console.log("\n✅ All models tested successfully!");
  } catch (err) {
    console.error("❌ Error testing DB:", err);
  } finally {
    mongoose.connection.close();
  }
}

testDB();
