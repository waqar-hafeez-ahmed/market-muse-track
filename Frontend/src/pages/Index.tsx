import { PortfolioSummary } from "@/components/PortfolioSummary";
import { HoldingsTable } from "@/components/HoldingsTable";
import { MarketNews } from "@/components/MarketNews";
import { PortfolioChart } from "@/components/PortfolioChart";
import { AddHoldingForm } from "@/components/AddHoldingForm";
import { usePortfolioHoldings, usePortfolioSummary } from "@/hooks/usePortfolio";
import { mockPortfolioData } from "@/data/mockData";

const Index = () => {
  const { data: holdings = [], isLoading } = usePortfolioHoldings(1) // Load Growth Portfolio data
  const summary = usePortfolioSummary(1)
  
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">Total Portfolio Overview</h1>
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
        <AddHoldingForm />

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

export default Index;