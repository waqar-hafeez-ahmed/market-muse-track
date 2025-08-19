import express from "express";
import {
  getHoldings,
  getGlobalHoldings,
} from "../services/portfolioService.js";

const router = express.Router();

/**
 * GET /api/holdings
 * Optional: ?portfolioId=<id>
 * Returns: { holdings, kpis }
 */
router.get("/", async (req, res) => {
  try {
    const { portfolioId } = req.query;

    const holdings = portfolioId
      ? await getHoldings(portfolioId)
      : await getGlobalHoldings();

    // simple KPIs rollup from holdings
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const totalCostBasis = holdings.reduce((s, h) => s + h.cost, 0);
    const totalPnL = totalValue - totalCostBasis;
    const totalPnLPct =
      totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
    const todaysChange = holdings.reduce((s, h) => s + h.todaysChange, 0);
    const yesterdayValue = totalValue - todaysChange;
    const todayChangePercent =
      yesterdayValue > 0 ? (todaysChange / yesterdayValue) * 100 : 0;

    res.json({
      holdings,
      kpis: {
        totalValue: Number(totalValue.toFixed(2)),
        totalCostBasis: Number(totalCostBasis.toFixed(2)),
        totalPnL: Number(totalPnL.toFixed(2)),
        totalPnLPct: Number(totalPnLPct.toFixed(2)),
        todayChange: Number(todaysChange.toFixed(2)),
        todayChangePercent: Number(todayChangePercent.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("❌ /api/holdings error:", err);
    res.status(500).json({ error: "Failed to compute holdings" });
  }
});

export default router;
