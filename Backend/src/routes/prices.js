// src/routes/pricesRoutes.js
import express from "express";
import { getStockPrices, getCryptoPrices } from "../services/priceService.js";

const router = express.Router();

// ✅ GET /api/prices/stocks?symbols=AAPL,GOOGL
router.get("/stocks", async (req, res) => {
  try {
    const { symbols } = req.query;
    const tickers = symbols ? symbols.split(",") : ["AAPL", "GOOGL"];
    const stocks = await getStockPrices(tickers);
    res.json(stocks);
  } catch (err) {
    console.error("❌ /api/prices/stocks error:", err);
    res.status(500).json({ error: "Failed to fetch stock prices" });
  }
});

// ✅ GET /api/prices/crypto?symbols=bitcoin,ethereum
router.get("/crypto", async (req, res) => {
  try {
    const { symbols } = req.query;
    const coins = symbols ? symbols.split(",") : ["bitcoin", "ethereum"];
    const crypto = await getCryptoPrices(coins);
    res.json(crypto);
  } catch (err) {
    console.error("❌ /api/prices/crypto error:", err);
    res.status(500).json({ error: "Failed to fetch crypto prices" });
  }
});

export default router;
