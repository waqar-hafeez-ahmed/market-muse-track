const API_BASE_URL = "http://localhost:4000/api";

// Helper function for API calls
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Portfolio APIs
export const portfolioAPI = {
  // Get all portfolios
  getPortfolios: () => apiCall("/portfolios"),

  // Get portfolio holdings
  getPortfolioHoldings: (portfolioId: string) =>
    apiCall(`/portfolios/${portfolioId}/holdings`),

  // Get portfolio summary
  getPortfolioSummary: (portfolioId: string) =>
    apiCall(`/portfolios/${portfolioId}/summary`),
};

// Transaction APIs
export const transactionAPI = {
  // Get all transactions
  getTransactions: () => apiCall("/transactions"),

  // Create transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTransaction: (transaction: any) =>
    apiCall("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),
};

export const newsAPI = {
  getMarketNews: () => apiCall("/news"),
  getStockNews: (symbol: string) => apiCall(`/news/${symbol}`),
};
