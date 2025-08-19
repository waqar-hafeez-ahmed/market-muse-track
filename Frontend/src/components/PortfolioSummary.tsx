import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface PortfolioSummaryProps {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export const PortfolioSummary = ({
  totalValue,
  dayChange,
  dayChangePercent,
  totalGainLoss,
  totalGainLossPercent,
}: PortfolioSummaryProps) => {
  const isPositiveDay = dayChange >= 0;
  const isPositiveTotal = totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-foreground">
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Change</p>
            <p className={`text-2xl font-bold ${isPositiveDay ? 'text-profit' : 'text-loss'}`}>
              {isPositiveDay ? '+' : ''}${dayChange.toLocaleString()}
            </p>
            <p className={`text-sm ${isPositiveDay ? 'text-profit' : 'text-loss'}`}>
              {isPositiveDay ? '+' : ''}{dayChangePercent.toFixed(2)}%
            </p>
          </div>
          {isPositiveDay ? (
            <TrendingUp className="h-8 w-8 text-profit" />
          ) : (
            <TrendingDown className="h-8 w-8 text-loss" />
          )}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${isPositiveTotal ? 'text-profit' : 'text-loss'}`}>
              {isPositiveTotal ? '+' : ''}${totalGainLoss.toLocaleString()}
            </p>
            <p className={`text-sm ${isPositiveTotal ? 'text-profit' : 'text-loss'}`}>
              {isPositiveTotal ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
          <Percent className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Portfolio Performance</p>
            <div className="mt-2">
              <div className={`h-2 w-full rounded-full ${isPositiveTotal ? 'bg-profit/20' : 'bg-loss/20'}`}>
                <div 
                  className={`h-2 rounded-full ${isPositiveTotal ? 'bg-profit' : 'bg-loss'}`}
                  style={{ width: `${Math.min(Math.abs(totalGainLossPercent), 100)}%` }}
                />
              </div>
            </div>
            <p className={`text-lg font-semibold mt-2 ${isPositiveTotal ? 'text-profit' : 'text-loss'}`}>
              {isPositiveTotal ? 'Profitable' : 'Loss'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};