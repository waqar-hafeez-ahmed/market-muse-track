import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface ChartDataPoint {
  date: string; // raw date string from API
  value: number; // portfolio value
  formattedDate: string; // display-friendly date
}

interface PortfolioChartProps {
  data: ChartDataPoint[];
  timeRange: string; // you can remove this if parent is not using it
}

export const PortfolioChart = ({ data }: PortfolioChartProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1M");

  // --- Filter function ---
  const filterDataByRange = (data: ChartDataPoint[], range: string) => {
    if (!data.length) return [];

    const now = new Date(data[data.length - 1].date); // assume last is latest
    let startDate: Date;

    switch (range) {
      case "1D":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "1Y":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "ALL":
      default:
        return data;
    }

    return data.filter((d) => new Date(d.date) >= startDate);
  };

  const filteredData = filterDataByRange(data, selectedTimeRange);
  const isPositiveGrowth =
    filteredData.length > 1 &&
    filteredData[filteredData.length - 1].value > filteredData[0].value;

  const timeRanges = [
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "1Y", value: "1Y" },
    { label: "All", value: "ALL" },
  ];

  // --- Custom tooltip ---
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{`${label}`}</p>
          <p className="text-primary">
            {`Value: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Portfolio Performance
        </h2>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={
                selectedTimeRange === range.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedTimeRange(range.value)}
              className="text-xs px-3 py-1 h-7"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="formattedDate"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                isPositiveGrowth ? "hsl(var(--profit))" : "hsl(var(--loss))"
              }
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: isPositiveGrowth
                  ? "hsl(var(--profit))"
                  : "hsl(var(--loss))",
                strokeWidth: 2,
                fill: "hsl(var(--card))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
