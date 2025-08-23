import { useEffect, useState } from "react";
import { snapshotAPI } from "@/services/apiService";

interface GlobalSnapshot {
  date: string;
  totalValue: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
  formattedDate: string;
}

export function useGlobalSnapshots() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobalSnapshots() {
      try {
        const res: GlobalSnapshot[] = await snapshotAPI.getGlobalSnapshots();

        // transform snapshots → chart-friendly data
        const chartData = res.map((s) => ({
          date: s.date,
          value: s.totalValue,
          formattedDate: new Date(s.date).toLocaleDateString(),
        }));

        setData(chartData);
      } catch (err) {
        console.error("❌ Failed to load global snapshots:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalSnapshots();
  }, []);

  return { data, loading };
}
