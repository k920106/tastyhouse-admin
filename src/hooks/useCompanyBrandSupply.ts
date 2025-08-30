'use client'

import { useState, useEffect } from 'react'
import { api } from '@/src/lib/api'
import { CompanyListItem } from '@/src/types/company'
import { BrandListItem } from '@/src/types/brand'
import { SupplyListItem } from '@/src/types/supply'
import { toast } from 'sonner'

interface UseCompanyBrandSupplyReturn {
  companies: CompanyListItem[]
  brands: BrandListItem[]
  supplies: SupplyListItem[]
  loading: boolean
  error: string | null
}

const MESSAGES = {
  ERROR: {
    companies: '매체사를 조회할 수 없습니다.',
    brands: '교환처를 조회할 수 없습니다.',
    supplies: '공급사를 조회할 수 없습니다.',
  },
} as const

export function useCompanyBrandSupply(): UseCompanyBrandSupplyReturn {
  const [companies, setCompanies] = useState<CompanyListItem[]>([])
  const [brands, setBrands] = useState<BrandListItem[]>([])
  const [supplies, setSupplies] = useState<SupplyListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [companiesResponse, brandsResponse, suppliesResponse] = await Promise.all([
          api.get<CompanyListItem[]>('/companies'),
          api.get<BrandListItem[]>('/brands'),
          api.get<SupplyListItem[]>('/supplies'),
        ])

        const companiesData = companiesResponse || []
        const brandsData = brandsResponse || []
        const suppliesData = suppliesResponse || []

        setCompanies(companiesData)
        setBrands(brandsData)
        setSupplies(suppliesData)

        // 각 데이터가 비어있는 경우 토스트 알림 표시
        if (companiesData.length === 0) {
          toast(MESSAGES.ERROR.companies)
        }
        if (brandsData.length === 0) {
          toast(MESSAGES.ERROR.brands)
        }
        if (suppliesData.length === 0) {
          toast(MESSAGES.ERROR.supplies)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.'
        setError(errorMessage)
        console.error('ERROR: ', err)
        toast('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    companies,
    brands,
    supplies,
    loading,
    error,
  }
}
