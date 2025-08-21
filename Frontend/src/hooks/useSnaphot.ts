import { useEffect, useState } from "react";
import { snapshotAPI } from "@/services/apiService";

interface Snapshot {
  _id: string;
  portfolioId: string;
  date: string;
  totalValue: number;
  currency: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
  formattedDate: string;
}

export function usePortfolioSnapshots(portfolioId: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshots() {
      try {
        const res: Snapshot[] = await snapshotAPI.getSnapshots(portfolioId);

        // transform snapshots → chart-friendly data
        const chartData = res.map((s) => ({
          date: s.date,
          value: s.totalValue,
          formattedDate: new Date(s.date).toLocaleDateString(),
        }));

        setData(chartData);
      } catch (err) {
        console.error("❌ Failed to load snapshots:", err);
      } finally {
        setLoading(false);
      }
    }

    if (portfolioId) fetchSnapshots();
  }, [portfolioId]);

  return { data, loading };
}
