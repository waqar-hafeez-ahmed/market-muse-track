// controllers/portfolioController.js
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { getHoldings } from "../services/portfolioService.js";
import { calculateKPIs } from "../utils/portfolioMath.js";
import { calculateKPIsFromHoldings } from "../utils/calculateKPIs.js";
import { computePortfolioSummary } from "../services/summaryService.js";

// List all portfolios
export const listPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    console.error("Error fetching portfolios:", err);
    res.status(500).json({ error: "Failed to fetch portfolios" });
  }
};

// Get holdings + KPIs for a portfolio
export const portfolioHoldings = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    // 1. Build holdings with prices
    const holdings = await getHoldings(portfolioId);

    // 2. Optionally calculate KPIs (if needed for dashboard)
    const transactions = await Transaction.find({ portfolio: portfolioId });
    const kpis = calculateKPIsFromHoldings(transactions, {}); // you can pass latestPrices if needed

    // 3. Respond
    res.json({
      portfolioId,
      holdings,
      kpis,
    });
  } catch (err) {
    console.error("Error fetching portfolio holdings:", err);
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
};

export async function getPortfolioSummary(req, res) {
  try {
    const { id } = req.params;
    const summary = await computePortfolioSummary(id);

    if (!summary) {
      return res.status(404).json({ message: "Portfolio not found or empty" });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
