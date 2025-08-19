// utils/groupHoldings.js
function groupHoldings(transactions, latestPrices) {
  return transactions.map(t => ({
    symbol: t.symbol,
    shares: t.shares,
    avgBuyPrice: t.price,
    currentPrice: latestPrices[t.symbol],
    marketValue: t.shares * latestPrices[t.symbol]
  }));
}

export default groupHoldings;
