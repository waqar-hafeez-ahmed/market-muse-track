import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioAPI, transactionAPI } from "@/services/apiService";

// Types
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
  portfolioId: string;
  symbol: string;
  action: "BUY" | "SELL";
  name: string;
  shares: number;
  avgCost: number;
  assetType?: string; // stock | crypto
}

// ---------------- Fetch Holdings ----------------
export const getPortfolioHoldings = async (
  portfolioId?: string
): Promise<PortfolioData> => {
  if (!portfolioId) {
    return { portfolioId: "", holdings: [], kpis: {} as KPIs };
  }
  return portfolioAPI.getPortfolioHoldings(portfolioId);
};

// ---------------- Add Holding (via transaction) ----------------
export const addPortfolioHolding = async (
  holding: InsertPortfolioHolding
): Promise<any> => {
  return transactionAPI.createTransaction({
    portfolioId: holding.portfolioId,
    assetType: holding.assetType ?? "stock",
    symbol: holding.symbol,
    name: holding.name,
    action: "BUY", // backend expects uppercase
    quantity: holding.shares,
    price: holding.avgCost,
  });
};

// ---------------- Update Holding ----------------
export const updatePortfolioHolding = async (
  id: string,
  updates: Partial<InsertPortfolioHolding>
): Promise<any> => {
  return transactionAPI.updateTransaction(id, updates);
};

// ---------------- Delete Holding ----------------
export const deletePortfolioHolding = async (id: string): Promise<boolean> => {
  await transactionAPI.deleteTransaction(id);
  return true;
};

// ---------------- React Query Hooks ----------------
export const usePortfolioHoldings = (portfolioId?: string) =>
  useQuery({
    queryKey: ["portfolio-holdings", portfolioId],
    queryFn: () => getPortfolioHoldings(portfolioId),
    enabled: !!portfolioId,
  });

export const useAddHolding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPortfolioHolding,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio-holdings", variables.portfolioId],
      });
      queryClient.invalidateQueries({
        queryKey: ["portfolio-summary", variables.portfolioId],
      });
    },
  });
};

export const useUpdateHolding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<InsertPortfolioHolding>;
    }) => updatePortfolioHolding(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio-holdings", variables.updates.portfolioId],
      });
    },
  });
};

export const useDeleteHolding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePortfolioHolding,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio-holdings", variables.portfolioId],
      });
    },
  });
};

export const usePortfolioSummary = (portfolioId?: string) =>
  useQuery({
    queryKey: ["portfolio-summary", portfolioId],
    queryFn: async () => {
      const res = await portfolioAPI.getPortfolioSummary(portfolioId!);
      return {
        totalValue: res.kpis.totalValue,
        dayChange: res.kpis.todayChange,
        dayChangePercent: res.kpis.todayChangePercent,
        totalGainLoss: res.kpis.totalPnL,
        totalGainLossPercent: res.kpis.totalPnLPct,
      };
    },
    enabled: !!portfolioId,
  });
