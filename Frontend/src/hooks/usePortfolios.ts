import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

// Types for portfolios
type Portfolio = Database['public']['Tables']['portfolios']['Row']
type InsertPortfolio = Database['public']['Tables']['portfolios']['Insert']
type UpdatePortfolio = Database['public']['Tables']['portfolios']['Update']

export type { Portfolio, InsertPortfolio, UpdatePortfolio }

// Function to get all portfolios
export const getPortfolios = async (): Promise<Portfolio[]> => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching portfolios:', error)
    return []
  }
  
  return data
}

// Function to add a new portfolio
export const addPortfolio = async (portfolio: Omit<InsertPortfolio, 'id' | 'created_at' | 'updated_at'>): Promise<Portfolio | null> => {
  const { data, error } = await supabase
    .from('portfolios')
    .insert([portfolio])
    .select()
  
  if (error) {
    console.error('Error adding portfolio:', error)
    return null
  }
  
  return data[0]
}

// Function to update a portfolio
export const updatePortfolio = async (id: number, updates: UpdatePortfolio): Promise<Portfolio | null> => {
  const { data, error } = await supabase
    .from('portfolios')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating portfolio:', error)
    return null
  }
  
  return data[0]
}

// Function to delete a portfolio
export const deletePortfolio = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting portfolio:', error)
    return false
  }
  
  return true
}

export const usePortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  })
}

export const useAddPortfolio = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })
}

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdatePortfolio }) =>
      updatePortfolio(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })
}

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings'] })
    },
  })
}