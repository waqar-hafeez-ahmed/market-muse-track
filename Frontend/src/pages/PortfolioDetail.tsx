import { useParams } from "react-router-dom";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { HoldingsTable } from "@/components/HoldingsTable";
import { MarketNews } from "@/components/MarketNews";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AddTransactionForm } from "@/components/AddHoldingForm";
import {
  usePortfolioHoldings,
  usePortfolioSummary,
} from "@/hooks/usePortfolio";
import { mockPortfolioData } from "@/data/mockData";

const PortfolioDetail = () => {
  const { portfolioId } = useParams();
  const id = parseInt(portfolioId || "1");

  const { data: holdings = [], isLoading } = usePortfolioHoldings(id);
  const summary = usePortfolioSummary(id);

  const portfolioNames = {
    1: "Growth Portfolio",
    2: "Conservative Portfolio",
    3: "Tech Focus Portfolio",
    4: "Dividend Portfolio",
    5: "Speculative Portfolio",
  } as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Portfolio Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {portfolioNames[id as keyof typeof portfolioNames] ||
              `Portfolio ${portfolioId}`}
          </h1>
        </div>
        {/* Portfolio Summary Cards */}
        <PortfolioSummary
          totalValue={summary.totalValue}
          dayChange={summary.dayChange}
          dayChangePercent={summary.dayChangePercent}
          totalGainLoss={summary.totalGainLoss}
          totalGainLossPercent={summary.totalGainLossPercent}
        />

        {/* Add New Holding Form */}
        <AddTransactionForm />

        {/* Chart and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioChart
            data={mockPortfolioData.chartData}
            timeRange="Last 6 Months"
          />
          <MarketNews news={mockPortfolioData.news} />
        </div>

        {/* Holdings Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading your portfolio...</div>
        ) : (
          <HoldingsTable holdings={holdings} />
        )}
      </main>
    </div>
  );
};

export default PortfolioDetail;
