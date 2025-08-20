import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioAPI, transactionAPI } from "@/services/apiService";

// Types for MongoDB data structure
interface PortfolioData {
  portfolioId: string;
  holdings: Holding[];
  kpis: KPIs;
}

interface Holding {
  _id: string;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface KPIs {
  totalValue: number;
  totalCostBasis: number;
  totalPnL: number;
  totalPnLPct: number;
  todayChange: number;
  todayChangePercent: number;
}

interface InsertPortfolioHolding {
  portfolioId?: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
}

// interface UpdatePortfolioHolding {
//   portfolioId?: string;
//   symbol?: string;
//   name?: string;
//   shares?: number;
//   avgCost?: number;
// }

// Function to get all holdings for a specific portfolio
export const getPortfolioHoldings = async (
  portfolioId?: string
): Promise<PortfolioData> => {
  if (!portfolioId) {
    return { portfolioId: "", holdings: [], kpis: {} as KPIs };
  }
  return portfolioAPI.getPortfolioHoldings(portfolioId);
};

// Function to add a new holding
export const addPortfolioHolding = async (
  holding: InsertPortfolioHolding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await fetch("http://localhost:4000/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      portfolioId: holding.portfolioId,
      assetType: "stock",
      symbol: holding.symbol,
      name: holding.name,
      action: "buy",
      quantity: holding.shares,
      price: holding.avgCost,
    }),
  });
  return response.json();
};

// // Function to update a holding
// export const updatePortfolioHolding = async (
//   id: string,
//   updates: UpdatePortfolioHolding
// ): Promise<any> => {
//   const response = await fetch(`http://localhost:4000/api/transactions/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updates),
//   });
//   return response.json();
// };

// // Function to delete a holding
// export const deletePortfolioHolding = async (id: string): Promise<boolean> => {
//   const response = await fetch(`http://localhost:4000/api/transactions/${id}`, {
//     method: "DELETE",
//   });
//   return response.ok;
// };

// Hooks updated for MongoDB data structure
export const usePortfolioHoldings = (portfolioId?: string) => {
  return useQuery({
    queryKey: ["portfolio-holdings", portfolioId],
    queryFn: () => getPortfolioHoldings(portfolioId),
    enabled: !!portfolioId,
  });
};

export const useAddHolding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPortfolioHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-holdings"] });
    },
  });
};

// export const useUpdateHolding = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       updates,
//     }: {
//       id: string;
//       updates: UpdatePortfolioHolding;
//     }) => updatePortfolioHolding(id, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["portfolio-holdings"] });
//     },
//   });
// };

// export const useDeleteHolding = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deletePortfolioHolding,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["portfolio-holdings"] });
//     },
//   });
// };

export const usePortfolioSummary = (portfolioId?: string) => {
  return useQuery({
    queryKey: ["portfolio-summary", portfolioId],
    queryFn: async () => {
      const res = await portfolioAPI.getPortfolioSummary(portfolioId!);
      // transform response to match frontend props
      return {
        ...res,
        totalValue: res.kpis.totalValue,
        dayChange: res.kpis.todayChange,
        dayChangePercent: res.kpis.todayChangePercent,
        totalGainLoss: res.kpis.totalPnL,
        totalGainLossPercent: res.kpis.totalPnLPct,
      };
    },
    enabled: !!portfolioId,
  });
};
