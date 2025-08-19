// utils/calculateKPIs.js
export function calculateKPIsFromHoldings(holdings) {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.cost, 0);
  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPct = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
  const todayChange = holdings.reduce((sum, h) => sum + h.todaysChange * h.quantity, 0);
  const todayChangePercent = totalValue > 0 ? (todayChange / totalValue) * 100 : 0;

  return {
    totalValue: parseFloat(totalValue.toFixed(2)),
    totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
    totalPnL: parseFloat(totalPnL.toFixed(2)),
    totalPnLPct: parseFloat(totalPnLPct.toFixed(2)),
    todayChange: parseFloat(todayChange.toFixed(2)),
    todayChangePercent: parseFloat(todayChangePercent.toFixed(2)),
  };
}
