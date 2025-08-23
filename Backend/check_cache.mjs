import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function checkCache() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Import PriceCache model
    const PriceCache = (await import("./src/models/PriceCache.js")).default;

    // Check all cached prices
    const cachedPrices = await PriceCache.find({});
    console.log("Cached prices:", JSON.stringify(cachedPrices, null, 2));

    // Check BTC specifically
    const btcCache = await PriceCache.findOne({ symbol: "BTC" });
    console.log("BTC cache:", JSON.stringify(btcCache, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkCache();
