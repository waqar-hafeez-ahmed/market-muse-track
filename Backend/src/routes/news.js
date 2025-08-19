import express from "express";
import { getStockNews } from "../services/newsService.js";

const router = express.Router();

// GET /news/:symbol
router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const news = await getStockNews(symbol);
  res.json({ symbol, news });
});

export default router;
