/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "http://localhost:4000/api";

// Helper function
const apiCall = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
      let errorCode = "API_ERROR";

      try {
        const data = await response.json();
        errorMessage = data.message || data.error || errorMessage;
        errorCode = data.code || errorCode;
      } catch {
        // Ignore JSON parsing errors
      }

      const error = new Error(errorMessage);
      (error as any).code = errorCode;
      throw error;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
};

// ---------------- Portfolio / Holdings ----------------
export const portfolioAPI = {
  // All portfolios
  getPortfolios: () => apiCall("/portfolios"),

  // Holdings (new unified route you mounted)
  getPortfolioHoldings: (portfolioId: string) =>
    apiCall(`/holdings?portfolioId=${encodeURIComponent(portfolioId)}`),

  // Global holdings (all portfolios)
  getGlobalHoldings: () => apiCall(`/holdings`),

  // Summary (reuse holdings.kpis or a summary endpoint if you keep one)
  getPortfolioSummary: (portfolioId: string) =>
    apiCall(`/holdings?portfolioId=${encodeURIComponent(portfolioId)}`),

  // Global summary (all portfolios)
  getGlobalSummary: () => apiCall(`/holdings`),
};

// ---------------- Transactions ----------------
export const transactionAPI = {
  // List all transactions for a portfolio (optional filter by symbol)
  getTransactions: (portfolioId: string, symbol?: string) =>
    apiCall(
      `/transactions?portfolioId=${encodeURIComponent(portfolioId)}${
        symbol ? `&symbol=${encodeURIComponent(symbol)}` : ""
      }`
    ),

  // Create transaction
  createTransaction: (transaction: any) =>
    apiCall("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  // Update
  updateTransaction: (id: string, updates: any) =>
    apiCall(`/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  // Delete
  deleteTransaction: (id: string) =>
    apiCall(`/transactions/${id}`, { method: "DELETE" }),
};

// ---------------- News ----------------
export const newsAPI = {
  getMarketNews: () => apiCall("/news"),
  getStockNews: (symbol: string) => apiCall(`/news/${symbol}`),
};

// ---------------- Snapshots ----------------
export const snapshotAPI = {
  // Get all snapshots for a portfolio
  getSnapshots: (portfolioId: string) =>
    apiCall(`/snapshots/${encodeURIComponent(portfolioId)}`),
};
