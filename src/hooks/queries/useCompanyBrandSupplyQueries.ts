'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/api'
import { BrandListItem } from '@/src/types/brand'
import { SupplyListItem } from '@/src/types/supply'

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get<BrandListItem[]>('/brands'),
    staleTime: 1000 * 60 * 10, // 10분
  })
}

export const useSuppliesQuery = () => {
  return useQuery({
    queryKey: ['supplies'],
    queryFn: () => api.get<SupplyListItem[]>('/supplies'),
    staleTime: 1000 * 60 * 10, // 10분
  })
}

export const useCompanyBrandSupplyQueries = () => {
  const brandsQuery = useBrandsQuery()
  const suppliesQuery = useSuppliesQuery()

  return {
    brands: brandsQuery.data || [],
    supplies: suppliesQuery.data || [],
    loading: brandsQuery.isLoading || suppliesQuery.isLoading,
    error: brandsQuery.error || suppliesQuery.error,
  }
}
