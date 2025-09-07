'use client'

import { api } from '@/src/lib/api'
import { BrandListItem } from '@/src/types/brand'
import { useQuery } from '@tanstack/react-query'

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get<BrandListItem[]>('/brands'),
    staleTime: 1000 * 60 * 60, // 60분
  })
}

export const useBrandQueries = () => {
  const companiesQuery = useBrandsQuery()

  return {
    brands: companiesQuery.data || [],
    loading: companiesQuery.isLoading,
    error: companiesQuery.error,
  }
}
