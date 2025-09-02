'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/api'
import { CompanyListItem } from '@/src/types/company'
import { BrandListItem } from '@/src/types/brand'
import { SupplyListItem } from '@/src/types/supply'

export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => api.get<CompanyListItem[]>('/companies'),
    staleTime: 1000 * 60 * 10, // 10분
  })
}

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
  const companiesQuery = useCompaniesQuery()
  const brandsQuery = useBrandsQuery()
  const suppliesQuery = useSuppliesQuery()

  return {
    companies: companiesQuery.data || [],
    brands: brandsQuery.data || [],
    supplies: suppliesQuery.data || [],
    loading: companiesQuery.isLoading || brandsQuery.isLoading || suppliesQuery.isLoading,
    error: companiesQuery.error || brandsQuery.error || suppliesQuery.error,
  }
}
