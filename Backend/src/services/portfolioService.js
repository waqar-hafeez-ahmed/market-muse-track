// services/portfolioService.js
import Transaction from "../models/Transaction.js";
import { getLatestPrices } from "./priceService.js";

/**
 * Compute holdings from a list of transactions and latest prices.
 * - FIFO/average-cost approximation
 */
function buildHoldings(transactions, latestPrices) {
  // group txs by symbol, sort by executedAt
  const bySymbol = new Map();
  for (const tx of transactions) {
    const sym = tx.symbol.toUpperCase();
    if (!bySymbol.has(sym)) bySymbol.set(sym, []);
    bySymbol.get(sym).push(tx);
  }
  for (const arr of bySymbol.values()) {
    arr.sort((a, b) => {
      const aT = a.executedAt || a.createdAt || 0;
      const bT = b.executedAt || b.createdAt || 0;
      return new Date(aT) - new Date(bT);
    });
  }

  const holdings = [];

  for (const [sym, txs] of bySymbol.entries()) {
    let qty = 0;
    let cost = 0;

    for (const tx of txs) {
      if (tx.action === "BUY") {
        qty += tx.quantity;
        cost += tx.quantity * tx.price;
      } else if (tx.action === "SELL") {
        const sellQty = tx.quantity;
        const avgCost = qty > 0 ? cost / qty : 0;
        qty -= sellQty;
        cost -= avgCost * sellQty;
        if (qty < 0) qty = 0;
        if (cost < 0) cost = 0;
      }
    }

    if (qty <= 0) continue;

    const p = latestPrices[sym];
    if (!p || !p.price) continue;

    const currentPrice = Number(p.price);
    const prevClose =
      p.previousClose !== undefined && p.previousClose !== null
        ? Number(p.previousClose)
        : null;

    const currentValue = qty * currentPrice;
    const totalPnL = currentValue - cost;
    const totalPnLPct = cost > 0 ? (totalPnL / cost) * 100 : 0;

    // today's change
    let todaysChangeAbs = 0;
    if (prevClose !== null) {
      todaysChangeAbs = (currentPrice - prevClose) * qty;
    } else if (p.change24h !== undefined && p.change24h !== null) {
      todaysChangeAbs = (Number(p.change24h) / 100) * currentValue;
    }

    const txIds = txs.map((t) => t._id);
    holdings.push({
      id: txIds[0],
      transactionIds: txIds,
      symbol: sym,
      name: p.name || sym,
      type: p.type,
      quantity: Number(qty.toFixed(8)),
      avgCost: qty > 0 ? Number((cost / qty).toFixed(8)) : 0,
      cost: Number(cost.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(4)),
      previousClose: prevClose !== null ? Number(prevClose.toFixed(4)) : null,
      currentValue: Number(currentValue.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      totalPnLPct: Number(totalPnLPct.toFixed(2)),
      todaysChange: Number(todaysChangeAbs.toFixed(2)),
      currency: p.currency || "USD",
      updatedAt: new Date().toISOString(),
    });
  }

  return holdings;
}

export async function getHoldings(portfolioId) {
  try {
    const txs = await Transaction.find({ portfolioId });
    if (!txs.length) return [];

    // collect unique symbols
    const symbols = [...new Set(txs.map((t) => t.symbol.toUpperCase().trim()))];

    const latestPrices = await getLatestPrices(symbols, "auto");
    return buildHoldings(txs, latestPrices);
  } catch (error) {
    console.error("❌ Error getting holdings:", error.message);
    throw new Error("Failed to fetch portfolio holdings");
  }
}

export async function getGlobalHoldings() {
  try {
    const txs = await Transaction.find({});
    if (!txs.length) return [];

    const symbols = [...new Set(txs.map((t) => t.symbol.toUpperCase().trim()))];

    const latestPrices = await getLatestPrices(symbols, "auto");
    return buildHoldings(txs, latestPrices);
  } catch (error) {
    console.error("❌ Error getting global holdings:", error.message);
    throw new Error("Failed to fetch global holdings");
  }
}
