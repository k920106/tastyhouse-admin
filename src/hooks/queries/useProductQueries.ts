'use client'

import { useEffect } from 'react'
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

  const query = useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<DataTablesResponse<ProductListItem>>(endpoint),
    enabled,
    staleTime: 1000 * 60 * 1, // 1분
  })

  const getProductsData = (): ProductListItem[] => {
    if (!query.data) {
      console.log('productResponse is undefined')
      return []
    }
    if (!query.data.data) {
      console.log('productResponse.data is undefined')
      return []
    }
    return query.data.data
  }

  const getTotalCount = (): number => {
    if (!query.data?.pagination) {
      console.log('productResponse.pagination is undefined')
      return 0
    }
    return query.data.pagination.total ?? 0
  }

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch products:', query.error)
    }
  }, [query.error])

  return {
    ...query,
    products: getProductsData(),
    totalCount: getTotalCount(),
  }
}
