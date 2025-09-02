'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/api'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { DataTablesResponse } from '@/src/types/api'

interface ProductQueryParams {
  searchForm: ProductSearchForm
  currentPage: number
  pageSize: number
}

const buildProductQueryParams = (params: ProductQueryParams) => {
  const { searchForm, currentPage, pageSize } = params

  const requestData = {
    companyId:
      searchForm.companyId && searchForm.companyId !== 'all'
        ? Number(searchForm.companyId)
        : undefined,
    brandId:
      searchForm.brandId && searchForm.brandId !== 'all' ? Number(searchForm.brandId) : undefined,
    supplyId:
      searchForm.supplyId && searchForm.supplyId !== 'all'
        ? Number(searchForm.supplyId)
        : undefined,
    display:
      searchForm.display && searchForm.display !== 'all'
        ? searchForm.display === 'true'
        : undefined,
    productCode: searchForm.productCode || undefined,
    name: searchForm.name || undefined,
    page: currentPage,
    size: pageSize,
    draw: 1,
  }

  const queryParams = new URLSearchParams()
  Object.entries(requestData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  })

  return queryParams.toString() ? `?${queryParams.toString()}` : ''
}

export const useProductsQuery = (params: ProductQueryParams, enabled = true) => {
  const queryParams = buildProductQueryParams(params)
  const endpoint = `/products${queryParams}`

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<DataTablesResponse<ProductListItem>>(endpoint),
    enabled,
    staleTime: 1000 * 60 * 1, // 1분
  })
}
