import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  avgCost: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

export const HoldingsTable = ({ holdings }: HoldingsTableProps) => {
  // Sort holdings by market value from highest to lowest
  const sortedHoldings = [...holdings].sort((a, b) => b.marketValue - a.marketValue);
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Holdings</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Investment</TableHead>
              <TableHead className="text-muted-foreground">Ticker</TableHead>
              <TableHead className="text-muted-foreground">Current Price</TableHead>
              <TableHead className="text-muted-foreground">Current Value</TableHead>
              <TableHead className="text-muted-foreground">Total gain/loss ($)</TableHead>
              <TableHead className="text-muted-foreground">Total gain/loss (%)</TableHead>
              <TableHead className="text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-muted-foreground">Cost</TableHead>
              <TableHead className="text-muted-foreground">Average Cost/Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHoldings.map((holding) => {
              const isTotalPositive = holding.gainLoss >= 0;
              const totalCost = holding.shares * holding.avgCost;

              return (
                <TableRow key={holding.symbol} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{holding.name}</TableCell>
                  <TableCell className="text-foreground">{holding.symbol}</TableCell>
                  <TableCell className="text-foreground">${holding.currentPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-foreground">${holding.marketValue.toLocaleString()}</TableCell>
                  <TableCell className={`${isTotalPositive ? 'text-profit' : 'text-loss'} font-semibold`}>
                    {isTotalPositive ? '+' : ''}${holding.gainLoss.toFixed(2)}
                  </TableCell>
                  <TableCell className={`${isTotalPositive ? 'text-profit' : 'text-loss'} font-semibold`}>
                    {isTotalPositive ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-foreground">{holding.shares}</TableCell>
                  <TableCell className="text-foreground">${totalCost.toFixed(2)}</TableCell>
                  <TableCell className="text-foreground">${holding.avgCost.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};