// utils/portfolioMath.js

/**
 * Calculates high-level KPIs for a set of transactions.
 * @param {Array} transactions - Array of transaction documents.
 * @param {Object} latestPrices - Object mapping symbols to their price data.
 * @returns {Object} An object containing calculated KPIs.
 */
export function calculateKPIs(transactions, latestPrices) {
  let totalValue = 0;
  let totalCostBasis = 0;
  let todayChange = 0;

  const holdings = calculateHoldings(transactions, latestPrices);

  holdings.forEach(holding => {
    totalCostBasis += holding.cost;
    totalValue += holding.currentValue;
    todayChange += holding.todaysChange;
  });

  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPct = totalCostBasis === 0 ? 0 : (totalPnL / totalCostBasis) * 100;

  const yesterdayValue = totalValue - todayChange;
  const todayChangePercent = yesterdayValue === 0 ? 0 : (todayChange / yesterdayValue) * 100;

  return {
    totalValue,
    totalCostBasis,
    totalPnL,
    totalPnLPct,
    todayChange,
    todayChangePercent,
  };
}

/**
 * Consolidates transactions into holdings and enriches with price data.
 * @param {Array} transactions - Array of transaction documents.
 * @param {Object} latestPrices - Object mapping symbols to their price data.
 * @returns {Array} An array of enriched holdings.
 */
export function calculateHoldings(transactions, latestPrices) {
  const rawHoldings = {};

  // Build raw cost/quantity from transactions
  transactions.forEach(tx => {
    const { symbol, assetType, action, quantity, price, name } = tx;

    if (!rawHoldings[symbol]) {
      rawHoldings[symbol] = {
        symbol,
        name,
        type: assetType, // "equity" or "crypto"
        quantity: 0,
        cost: 0,
      };
    }

    const totalCost = quantity * price;
    if (action === "BUY") {
      rawHoldings[symbol].quantity += quantity;
      rawHoldings[symbol].cost += totalCost;
    } else if (action === "SELL") {
      rawHoldings[symbol].quantity -= quantity;
      rawHoldings[symbol].cost -= totalCost;
    }
  });

  // Enrich with price data
  const enrichedHoldings = Object.values(rawHoldings).map(h => {
    const latest = latestPrices[h.symbol] || {};
    const currentPrice = latest.price || latest.usd || 0;
    const previousClose =
      latest.previousClose !== undefined
        ? latest.previousClose
        : latest.usd_24h_change !== undefined
        ? currentPrice / (1 + latest.usd_24h_change / 100)
        : 0;

    const currentValue = h.quantity * currentPrice;
    const totalPnL = currentValue - h.cost;
    const totalPnLPct = h.cost === 0 ? 0 : (totalPnL / h.cost) * 100;

    let todaysChange = 0;
    if (latest.price && latest.previousClose !== undefined) {
      // Stock
      todaysChange = (currentPrice - latest.previousClose) * h.quantity;
    } else if (latest.price && latest.change24h !== undefined) {
      // Crypto
      todaysChange = (latest.change24h / 100) * currentValue;
    }

    return {
      symbol: h.symbol,
      name: h.name || h.symbol,
      type: h.type,
      quantity: h.quantity,
      avgCost: h.quantity > 0 ? h.cost / h.quantity : 0,
      cost: h.cost,
      currentPrice,
      previousClose,
      currentValue,
      totalPnL,
      totalPnLPct,
      todaysChange,
      currency: latest.currency || "USD",
      updatedAt: new Date().toISOString(),
    };
  });

  return enrichedHoldings;
}
