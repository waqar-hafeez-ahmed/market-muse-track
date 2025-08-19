// src/routes/portfolioRoutes.js
import express from "express";
import {
  listPortfolios,
  portfolioHoldings,
  getPortfolioSummary,
} from "../controllers/portfolioController.js";
import { getStockPrices, getCryptoPrices } from "../services/priceService.js";

const router = express.Router();

// ✅ GET /api/portfolios → List all portfolios
router.get("/", listPortfolios);

// ✅ GET /api/portfolios/:id/holdings → Get holdings of one portfolio
router.get("/:id/holdings", portfolioHoldings);

// Get portfolio summary
router.get("/:id/summary", getPortfolioSummary);

router.get("/test/prices", async (req, res) => {
  try {
    const stocks = await getStockPrices(["AAPL", "GOOGL"]);
    const crypto = await getCryptoPrices(["bitcoin", "ethereum"]);
    res.json({ stocks, crypto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Price service failed" });
  }
});

export default router;
