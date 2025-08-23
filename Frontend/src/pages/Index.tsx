/* eslint-disable @typescript-eslint/no-explicit-any */
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { HoldingsTable } from "@/components/HoldingsTable";
import { MarketNews } from "@/components/MarketNews";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AddTransactionForm } from "@/components/AddHoldingForm";
import {
  usePortfolioHoldings,
  usePortfolioSummary,
  useDeleteHolding,
  useUpdateHolding,
  useGlobalHoldings,
} from "@/hooks/usePortfolio";
import { useGlobalSnapshots } from "@/hooks/useGlobalSnapshots";

const Index = () => {
  const { data: globalHoldings, isLoading } = useGlobalHoldings();
  // For now, we'll use the global holdings data for summary
  // In a real implementation, you might want a separate global summary endpoint
  const summary = {
    data: globalHoldings?.kpis
      ? {
          totalValue: globalHoldings.kpis.totalValue,
          dayChange: globalHoldings.kpis.todayChange,
          dayChangePercent: globalHoldings.kpis.todayChangePercent,
          totalGainLoss: globalHoldings.kpis.totalPnL,
          totalGainLossPercent: globalHoldings.kpis.totalPnLPct,
        }
      : null,
    isLoading,
    isError: false,
  };

  // Use global snapshots for performance chart
  const { data: performance, loading: performanceLoading } =
    useGlobalSnapshots();

  const holdings =
    globalHoldings?.holdings?.map((h: any) => ({
      id: h.transactionIds?.[0] || h._id, // ✅ pick the first transaction ID
      holdingId: h._id,
      symbol: h.symbol,
      name: h.name,
      shares: h.quantity,
      currentPrice: h.currentPrice,
      avgCost: h.avgCost,
      marketValue: h.currentValue, // ✅ mapped correctly
      gainLoss: h.totalPnL, // ✅ backend total PnL
      gainLossPercent: h.totalPnLPct, // ✅ backend PnL %
      dayChange: h.todaysChange, // ✅ backend today's change
      dayChangePercent: h.previousClose
        ? ((h.currentPrice - h.previousClose) / h.previousClose) * 100
        : 0, // ✅ compute if needed
    })) ?? [];

  const deleteHoldingMutation = useDeleteHolding(
    holdings.find((h) => true)?.holdingId || ""
  );
  const updateHoldingMutation = useUpdateHolding(
    holdings.find((h) => true)?.holdingId || ""
  );

  const handleDeleteTransaction = async (id: string) => {
    await deleteHoldingMutation.mutateAsync(id);
  };

  const handleEditTransaction = async (id: string) => {
    console.log(id);

    // Ask for quantity
    const qtyStr = window.prompt("Enter new quantity:");
    if (!qtyStr) return;
    const quantity = Number(qtyStr);
    if (Number.isNaN(quantity)) return;

    // Send to backend
    await updateHoldingMutation.mutateAsync({
      id,
      updates: { quantity: quantity },
    });
  };

  if (summary.isLoading) {
    return <div>Loading...</div>;
  }

  if (summary.isError) {
    return <div>Error loading summary</div>;
  }

  if (!summary.data) {
    return <div>No data</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Total Portfolio Overview
          </h1>
        </div>

        {/* Portfolio Summary Cards */}
        <PortfolioSummary
          totalValue={summary.data.totalValue}
          dayChange={summary.data.dayChange}
          dayChangePercent={summary.data.dayChangePercent}
          totalGainLoss={summary.data.totalGainLoss}
          totalGainLossPercent={summary.data.totalGainLossPercent}
        />

        {/* Add New Holding Form */}
        {/* <AddTransactionForm portfolioId="68a45b0f1ec49f52c1f0c81f" /> */}

        {/* Chart and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioChart data={performance} timeRange="Last 6 Months" />
          <MarketNews />
        </div>

        {/* Holdings Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading your portfolio...</div>
        ) : (
          <HoldingsTable
            holdings={holdings}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
