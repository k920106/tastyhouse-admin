'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/api'
import { CompanyListItem } from '@/src/types/company'

export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => api.get<CompanyListItem[]>('/companies'),
    staleTime: 1000 * 60 * 60, // 60분
  })
}

export const useCompanyQueries = () => {
  const companiesQuery = useCompaniesQuery()

  return {
    companies: companiesQuery.data || [],
    loading: companiesQuery.isLoading,
    error: companiesQuery.error,
  }
}
