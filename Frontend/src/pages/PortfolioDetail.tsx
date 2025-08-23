import { useParams } from "react-router-dom";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { HoldingsTable } from "@/components/HoldingsTable";
import { MarketNews } from "@/components/MarketNews";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AddTransactionForm } from "@/components/AddHoldingForm";
import {
  useDeleteHolding,
  usePortfolioHoldings,
  usePortfolioSummary,
  useUpdateHolding,
} from "@/hooks/usePortfolio";
import { mockPortfolioData } from "@/data/mockData";
import { getPortfolioById } from "@/data/PortfolioList";
import { usePortfolioSnapshots } from "@/hooks/useSnaphot";

const PortfolioDetail = () => {
  const { portfolioId } = useParams();
  // const id = parseInt(portfolioId);

  const { data, isLoading } = usePortfolioHoldings(portfolioId);
  const summary = usePortfolioSummary(portfolioId);

  const portfolio = getPortfolioById(portfolioId);
  const { data: performance, loading } = usePortfolioSnapshots(portfolioId);

  const holdings =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.holdings?.map((h: any) => ({
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

    // Ask for price
    const priceStr = window.prompt("Enter new price:");
    if (!priceStr) return;
    const price = Number(priceStr);
    if (Number.isNaN(price)) return;

    // Ask for quantity
    const qtyStr = window.prompt("Enter new quantity:");
    if (!qtyStr) return;
    const quantity = Number(qtyStr);
    if (Number.isNaN(quantity)) return;

    // Send both to backend
    await updateHoldingMutation.mutateAsync({
      id,
      updates: { price: price, quantity: quantity },
    });
  };

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
        {/* Portfolio Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
<<<<<<< HEAD
            {`${portfolio?.name || portfolioId}`}
=======
            {portfolio?.name || portfolioId}
>>>>>>> 3b694e21b1419f84718b853efff4974a1e1e29cf
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
        <AddTransactionForm portfolioId={portfolioId} />

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

export default PortfolioDetail;
