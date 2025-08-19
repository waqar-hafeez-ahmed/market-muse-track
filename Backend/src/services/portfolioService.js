// services/portfolioService.js
import Transaction from "../models/Transaction.js";
import { getStockPrices, getCryptoPrices } from "./priceService.js";

/**
 * Compute holdings from a list of transactions and latest prices.
 * - FIFO/average-cost approximation:
 *   BUY:  qty += q;   cost += q * price (+ fee if you store it)
 *   SELL: qty -= q;   cost -= avgCostBeforeSell * q
 */
function buildHoldings(transactions, latestPrices) {
  // group txs by symbol, sort by executedAt to apply sells in order
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
    let cost = 0; // cost basis

    for (const tx of txs) {
      // ignore non-trade movements for now (DIVIDEND/DEPOSIT/WITHDRAW)
      if (tx.action === "BUY") {
        qty += tx.quantity;
        cost += tx.quantity * tx.price; // + (tx.fee || 0);  // add if you want to include fees
      } else if (tx.action === "SELL") {
        const sellQty = tx.quantity;
        const avgCost = qty > 0 ? cost / qty : 0;
        qty -= sellQty;
        // reduce cost *by average cost*, not by sale proceeds
        cost -= avgCost * sellQty;
        if (qty < 0) qty = 0; // guard
        if (cost < 0) cost = 0;
      }
    }

    if (qty <= 0) continue; // don’t show closed-out positions

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

    // today's change (absolute)
    let todaysChangeAbs = 0;
    if (prevClose !== null) {
      // stocks path
      todaysChangeAbs = (currentPrice - prevClose) * qty;
    } else if (p.change24h !== undefined && p.change24h !== null) {
      // crypto path
      todaysChangeAbs = (Number(p.change24h) / 100) * currentValue;
    }

    holdings.push({
      symbol: sym,
      name: p.name || sym,
      type: p.type, // "equity" | "crypto"
      quantity: Number(qty.toFixed(8)),
      avgCost: qty > 0 ? Number((cost / qty).toFixed(8)) : 0,
      cost: Number(cost.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(4)),
      previousClose: prevClose !== null ? Number(prevClose.toFixed(4)) : null,
      currentValue: Number(currentValue.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      totalPnLPct: Number(totalPnLPct.toFixed(2)),
      todaysChange: Number(todaysChangeAbs.toFixed(2)), // absolute $
      currency: p.currency || "USD",
      updatedAt: new Date().toISOString(),
    });
  }

  return holdings;
}

export async function getHoldings(portfolioId) {
  const txs = await Transaction.find({ portfolioId });
  if (!txs.length) return [];

  const stockSymbols = [
    ...new Set(txs.filter((t) => t.assetType === "stock").map((t) => t.symbol)),
  ];
  const cryptoSymbols = [
    ...new Set(
      txs
        .filter((t) => t.assetType === "crypto")
        .map((t) => t.symbol.toUpperCase())
    ),
  ];

  const [stockPrices, cryptoPrices] = await Promise.all([
    stockSymbols.length ? getStockPrices(stockSymbols) : {},
    cryptoSymbols.length ? getCryptoPrices(cryptoSymbols) : {},
  ]);

  const latestPrices = { ...stockPrices, ...cryptoPrices };
  return buildHoldings(txs, latestPrices);
}

// Optional: global holdings across all portfolios
export async function getGlobalHoldings() {
  const txs = await Transaction.find({});
  if (!txs.length) return [];

  const stockSymbols = [
    ...new Set(txs.filter((t) => t.assetType === "stock").map((t) => t.symbol)),
  ];
  const cryptoSymbols = [
    ...new Set(
      txs
        .filter((t) => t.assetType === "crypto")
        .map((t) => t.symbol.toUpperCase())
    ),
  ];

  const [stockPrices, cryptoPrices] = await Promise.all([
    stockSymbols.length ? getStockPrices(stockSymbols) : {},
    cryptoSymbols.length ? getCryptoPrices(cryptoSymbols) : {},
  ]);

  const latestPrices = { ...stockPrices, ...cryptoPrices };
  return buildHoldings(txs, latestPrices);
}
