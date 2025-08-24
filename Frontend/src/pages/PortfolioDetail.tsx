import { useState } from "react";
import { useParams } from "react-router-dom";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { HoldingsTable } from "@/components/HoldingsTable";
import { MarketNews } from "@/components/MarketNews";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AddTransactionForm } from "@/components/AddHoldingForm";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import {
  useDeleteHolding,
  usePortfolioHoldings,
  usePortfolioSummary,
  useUpdateHolding,
} from "@/hooks/usePortfolio";
import { mockPortfolioData } from "@/data/mockData";
import { getPortfolioById } from "@/data/PortfolioList";
import { usePortfolioSnapshots } from "@/hooks/useSnaphot";
import { toast } from "sonner";

const PortfolioDetail = () => {
  const { portfolioId } = useParams();
  // const id = parseInt(portfolioId);

  const { data, isLoading } = usePortfolioHoldings(portfolioId);
  const summary = usePortfolioSummary(portfolioId);

  const portfolio = getPortfolioById(portfolioId);
  const { data: performance, loading } = usePortfolioSnapshots(portfolioId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    symbol: string;
    name: string;
    price: number;
    quantity: number;
  } | null>(null);

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

  const deleteHoldingMutation = useDeleteHolding(portfolioId);
  const updateHoldingMutation = useUpdateHolding(portfolioId);

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteHoldingMutation.mutateAsync(id);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Delete error:", error);
    }
  };

  const handleEditTransaction = (id: string) => {
    const holding = holdings.find((h) => h.id === id);
    if (!holding) return;

    setEditingTransaction({
      id,
      symbol: holding.symbol,
      name: holding.name,
      price: holding.avgCost,
      quantity: holding.shares,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = async (
    id: string,
    updates: { price: number; quantity: number }
  ) => {
    try {
      await updateHoldingMutation.mutateAsync({
        id,
        updates,
      });
      toast.success("Transaction updated successfully");
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error("Update error:", error);
    }
  };

  if (summary.isError) {
    return <div>Error loading summary</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!summary.data && !isLoading) {
    return <div>Loading Data.....</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Portfolio Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {portfolio?.name || portfolioId}
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

        {/* Edit Transaction Modal */}
        {editingTransaction && (
          <EditTransactionModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingTransaction(null);
            }}
            onSave={handleSaveTransaction}
            transactionId={editingTransaction.id}
            initialPrice={editingTransaction.price}
            initialQuantity={editingTransaction.quantity}
            symbol={editingTransaction.symbol}
            name={editingTransaction.name}
          />
        )}
      </main>
    </div>
  );
};

export default PortfolioDetail;
