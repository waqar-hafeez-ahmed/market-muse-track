// utils/fetchPortfolioData.js
import Transaction from "../models/Transaction.js";
import { getStockPrices, getCryptoPrices } from "../services/priceService.js";

export async function fetchPortfolioData(portfolioId) {
  // Get transactions for this portfolio
  const transactions = await Transaction.find({ portfolioId });

  if (!transactions.length) {
    throw new Error("No transactions found for this portfolio");
  }

  // Extract symbols
  const stockSymbols = [...new Set(transactions
    .filter(t => t.assetType === "stock")
    .map(t => t.symbol))];

  const cryptoIds = [...new Set(transactions
    .filter(t => t.assetType === "crypto")
    .map(t => t.symbol.toLowerCase()))];

  // Get prices
  const stockPrices = stockSymbols.length ? await getStockPrices(stockSymbols) : {};
  const cryptoPrices = cryptoIds.length ? await getCryptoPrices(cryptoIds) : {};

  return {
    transactions,
    latestPrices: { ...stockPrices, ...cryptoPrices }
  };
}
