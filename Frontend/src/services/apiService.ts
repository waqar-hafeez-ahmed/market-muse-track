/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "http://localhost:4000/api";

// Helper function
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let msg = `API call failed: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      msg = data.error || msg;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(msg);
  }

  return response.json();
};

// ---------------- Portfolio / Holdings ----------------
export const portfolioAPI = {
  // All portfolios
  getPortfolios: () => apiCall("/portfolios"),

  // Holdings (new unified route you mounted)
  getPortfolioHoldings: (portfolioId: string) =>
    apiCall(`/holdings?portfolioId=${encodeURIComponent(portfolioId)}`),

  // Summary (reuse holdings.kpis or a summary endpoint if you keep one)
  getPortfolioSummary: (portfolioId: string) =>
    apiCall(`/holdings?portfolioId=${encodeURIComponent(portfolioId)}`),
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
