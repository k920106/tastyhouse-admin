'use client'

import { api } from '@/src/lib/api'
import { SupplyListItem } from '@/src/types/supply'
import { useQuery } from '@tanstack/react-query'

export const useSuppliesQuery = () => {
  return useQuery({
    queryKey: ['supplies'],
    queryFn: () => api.get<SupplyListItem[]>('/supplies'),
    staleTime: 1000 * 60 * 60, // 60분
  })
}

export const useSupplyQueries = () => {
  const suppliesQuery = useSuppliesQuery()

  return {
    supplies: suppliesQuery.data || [],
    loading: suppliesQuery.isLoading,
    error: suppliesQuery.error,
  }
}
