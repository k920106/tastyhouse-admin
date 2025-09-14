'use client'

import { api } from '@/src/lib/api'
import { isEmptyValue } from '@/src/lib/validations/product'
import { PagedApiResponse } from '@/src/types/api'
import { ProductListItem, ProductSearchForm } from '@/src/types/product'
import { useQuery } from '@tanstack/react-query'

interface ProductQueryParams {
  searchForm: ProductSearchForm
  pagination: {
    page: number
    size: number
  }
}

interface ProductQueryData {
  products: ProductListItem[]
  totalElements: number
}

const buildProductQueryString = (params: ProductQueryParams): string => {
  const { searchForm, pagination } = params

  const requestData = {
    companyId: !isEmptyValue(searchForm.companyId) ? Number(searchForm.companyId) : undefined,
    brandId: !isEmptyValue(searchForm.brandId) ? Number(searchForm.brandId) : undefined,
    supplyId: !isEmptyValue(searchForm.supplyId) ? Number(searchForm.supplyId) : undefined,
    display: !isEmptyValue(searchForm.display) ? searchForm.display === 'true' : undefined,
    productCode: searchForm.productCode || undefined,
    name: searchForm.name || undefined,
    page: pagination.page,
    size: pagination.size,
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
  return useQuery<PagedApiResponse<ProductListItem>, Error, ProductQueryData>({
    queryKey: ['products', params],
    queryFn: async () => {
      const queryString = buildProductQueryString(params)
      return api.get<PagedApiResponse<ProductListItem>>(`/products${queryString}`)
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분으로 증가
    gcTime: 1000 * 60 * 10, // 10분 가비지 컬렉션
    select: (data): ProductQueryData => ({
      products: data.data || [],
      totalElements: data.pagination?.totalElements || 0,
    }),
    throwOnError: false, // 에러를 throw하지 않고 error 상태로 반환
  })
}
