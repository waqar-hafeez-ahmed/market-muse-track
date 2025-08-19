import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'

// Create a simple client without complex types
const supabaseUrl = "https://jhhypbwgztoywksucvdn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoaHlwYndnenRveXdrc3VjdmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjI5NzQsImV4cCI6MjA2OTk5ODk3NH0.YrGHUVfMe8Houc5G36LZvJ1BhThdo7R9b9mzgMPwBTM"
const supabase = createClient(supabaseUrl, supabaseKey)

// Direct type definitions to avoid circular reference issues
interface PortfolioHolding {
  id: number
  portfolio_id: number | null
  symbol: string
  name: string
  shares: number
  avg_cost: number
  created_at: string
  updated_at: string
}

interface InsertPortfolioHolding {
  portfolio_id?: number | null
  symbol: string
  name: string
  shares: number
  avg_cost: number
}

interface UpdatePortfolioHolding {
  portfolio_id?: number | null
  symbol?: string
  name?: string
  shares?: number
  avg_cost?: number
}

// Enhanced holding type with calculated metrics
interface EnhancedHolding extends PortfolioHolding {
  avgCost: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
  dayChange: number
  dayChangePercent: number
}

// Export types for use in components
export type { PortfolioHolding, InsertPortfolioHolding, UpdatePortfolioHolding, EnhancedHolding }

// Function to get all holdings for a specific portfolio
export const getPortfolioHoldings = async (portfolioId?: number): Promise<PortfolioHolding[]> => {
  let query = supabase
    .from('portfolio_holdings')
    .select('*')
    .order('symbol', { ascending: true })
  
  if (portfolioId) {
    query = query.eq('portfolio_id', portfolioId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching holdings:', error)
    return []
  }
  
  return data as PortfolioHolding[]
}

// Function to add a new holding
export const addPortfolioHolding = async (holding: Omit<InsertPortfolioHolding, 'id' | 'created_at' | 'updated_at'> & { portfolio_id: number }): Promise<PortfolioHolding | null> => {
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .insert([holding])
    .select()
  
  if (error) {
    console.error('Error adding holding:', error)
    return null
  }
  
  return data[0] as PortfolioHolding
}

// Function to update a holding
export const updatePortfolioHolding = async (id: number, updates: UpdatePortfolioHolding): Promise<PortfolioHolding | null> => {
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating holding:', error)
    return null
  }
  
  return data?.[0] as PortfolioHolding || null
}

// Function to delete a holding
export const deletePortfolioHolding = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('portfolio_holdings')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting holding:', error)
    return false
  }
  
  return true
}

// Current prices from your exact portfolio data
const mockCurrentPrices: Record<string, number> = {
  'NVDA': 178.26,
  'META': 763.46,
  'QTUM': 92.52,
  'GOOG': 195.32,
  'MSFT': 527.75,
  'TSLA': 308.72,
  'IBM': 250.69,
  'AMZN': 213.75,
  'ARKQ': 98.70,
  'AAPL': 202.92,
  'AVGO': 292.93,
  'RGTI': 16.47,
  'PLTR': 173.27,
  'ZYX': 75.32,
  'TSM': 232.43,
  'AMD': 174.31,
  'IONQ': 42.05,
  'GLD': 311.16,
  'COIN': 297.99,
  'CRWV': 111.84,
  'QUBT': 16.89,
  'QBTS': 18.32,
  'AI': 23.29,
  'PATH': 11.215,
  'DJT': 16.39,
  'SNOW': 205.81,
  'ARQQ': 373.80,
  'CASH': 220.64, // Cash position - static value
}

// Calculate market metrics for a holding
const calculateHoldingMetrics = (holding: PortfolioHolding): EnhancedHolding => {
  // For cash, use the avg_cost as both current price and market value
  if (holding.symbol === 'CASH') {
    return {
      ...holding,
      avgCost: holding.avg_cost,
      currentPrice: holding.avg_cost,
      marketValue: holding.avg_cost,
      gainLoss: 0,
      gainLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0
    }
  }
  
  const currentPrice = mockCurrentPrices[holding.symbol] || holding.avg_cost
  const marketValue = holding.shares * currentPrice
  const gainLoss = marketValue - (holding.shares * holding.avg_cost)
  const gainLossPercent = ((gainLoss / (holding.shares * holding.avg_cost)) * 100)
  
  return {
    ...holding,
    avgCost: holding.avg_cost, // Map avg_cost to avgCost for component compatibility
    currentPrice,
    marketValue,
    gainLoss,
    gainLossPercent,
    dayChange: currentPrice * 0.02, // Mock 2% daily change
    dayChangePercent: 2.0
  }
}

export const usePortfolioHoldings = (portfolioId?: number) => {
  return useQuery({
    queryKey: ['portfolio-holdings', portfolioId],
    queryFn: async () => {
      const holdings = await getPortfolioHoldings(portfolioId)
      return holdings.map(calculateHoldingMetrics)
    },
  })
}

export const useAddHolding = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addPortfolioHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings'] })
    },
  })
}

export const useUpdateHolding = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdatePortfolioHolding }) =>
      updatePortfolioHolding(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings'] })
    },
  })
}

export const useDeleteHolding = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePortfolioHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings'] })
    },
  })
}

export const usePortfolioSummary = (portfolioId?: number) => {
  const { data: holdings = [] } = usePortfolioHoldings(portfolioId)
  
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.shares * holding.avg_cost), 0)
  const totalGainLoss = totalValue - totalCost
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
  const dayChange = holdings.reduce((sum, holding) => sum + (holding.dayChange * holding.shares), 0)
  const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0
  
  return {
    totalValue,
    dayChange,
    dayChangePercent,
    totalGainLoss,
    totalGainLossPercent,
  }
}