// services/summaryService.js
import Transaction from "../models/Transaction.js";
import { getLatestPrices } from "./priceService.js";
import { calculateKPIs, calculateHoldings } from "../utils/portfolioMath.js";

export async function computePortfolioSummary(portfolioId) {
  // ✅ Get transactions for this portfolio only
  const transactions = await Transaction.find({ portfolioId });
  if (!transactions.length) return null;

  const symbols = [...new Set(transactions.map((t) => t.symbol))];
  const latestPrices = await getLatestPrices(symbols);

  const holdings = calculateHoldings(transactions, latestPrices);
  const kpis = calculateKPIs(transactions, latestPrices);

  return { holdings, kpis };
}
