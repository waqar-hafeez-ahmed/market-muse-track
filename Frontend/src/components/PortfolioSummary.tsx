import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface PortfolioSummaryProps {
  totalValue?: number;
  dayChange?: number;
  dayChangePercent?: number;
  totalGainLoss?: number;
  totalGainLossPercent?: number;
}

export const PortfolioSummary = ({
  totalValue = 0,
  dayChange = 0,
  dayChangePercent = 0,
  totalGainLoss = 0,
  totalGainLossPercent = 0,
}: PortfolioSummaryProps) => {
  const isPositiveDay = (dayChange || 0) >= 0;
  const isPositiveTotal = (totalGainLoss || 0) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${(totalValue || 0).toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Today's Change
            </p>
            <p
              className={`text-2xl font-bold ${
                (dayChange || 0) >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {(dayChange || 0) >= 0 ? "+" : ""}$
              {(dayChange || 0).toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                (dayChange || 0) >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {(dayChange || 0) >= 0 ? "+" : ""}
              {(dayChangePercent || 0).toFixed(2)}%
            </p>
          </div>
          {(dayChange || 0) >= 0 ? (
            <TrendingUp className="h-8 w-8 text-profit" />
          ) : (
            <TrendingDown className="h-8 w-8 text-loss" />
          )}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Gain/Loss
            </p>
            <p
              className={`text-2xl font-bold ${
                (totalGainLoss || 0) >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {(totalGainLoss || 0) >= 0 ? "+" : ""}$
              {(totalGainLoss || 0).toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                (totalGainLoss || 0) >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {(totalGainLoss || 0) >= 0 ? "+" : ""}
              {(totalGainLossPercent || 0).toFixed(2)}%
            </p>
          </div>
          <Percent className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Portfolio Performance
            </p>
            <div className="mt-2">
              <div
                className={`h-2 w-full rounded-full ${
                  (totalGainLoss || 0) >= 0 ? "bg-profit/20" : "bg-loss/20"
                }`}
              >
                <div
                  className={`h-2 rounded-full ${
                    (totalGainLoss || 0) >= 0 ? "bg-profit" : "bg-loss"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.abs(totalGainLossPercent || 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <p
              className={`text-lg font-semibold mt-2 ${
                (totalGainLoss || 0) >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {(totalGainLoss || 0) >= 0 ? "Profitable" : "Loss"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
