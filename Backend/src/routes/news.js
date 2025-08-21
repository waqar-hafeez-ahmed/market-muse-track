import express from "express";
import { getStockNews } from "../services/newsService.js";

const router = express.Router();

// GET /api/news → generic financial news
router.get("/", async (req, res) => {
  const news = await getStockNews("stock market"); // broad search term
  res.json({ symbol: "market", news });
});

// GET /api/news/:symbol → company-specific news
router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const news = await getStockNews(symbol);
  res.json({ symbol, news });
});

export default router;
