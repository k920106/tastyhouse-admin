import { api } from '@/src/lib/api'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { PagedApiResponse } from '@/src/types/api'
import { Product, ProductSearchFormInput } from '@/src/types/product'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productSearchQuerySchema } from './useProductSearchForm'

interface ProductQueryParams {
  searchForm: ProductSearchFormInput
  pagination: {
    page: ApiPage
    size: number
  }
}

interface ProductQueryData {
  products: Product[]
  totalElements: number
}

const buildProductQueryString = (params: ProductQueryParams): string => {
  const { searchForm, pagination } = params

  const searchQuery = productSearchQuerySchema.parse(searchForm)

  const requestData = {
    ...searchQuery,
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
  const queryClient = useQueryClient()

  const result = useQuery<PagedApiResponse<Product>, Error, ProductQueryData>({
    queryKey: [
      'products',
      {
        searchForm: params.searchForm,
        page: params.pagination.page,
        size: params.pagination.size,
      },
    ],
    queryFn: async () => {
      const queryString = buildProductQueryString(params)
      return api.get<PagedApiResponse<Product>>(`/products${queryString}`)
    },
    enabled,
    staleTime: 1000 * 30, // 30초로 축소 (실시간성 향상)
    gcTime: 1000 * 60 * 5, // 5분으로 축소 (메모리 효율성)
    select: (data): ProductQueryData => ({
      products: data.data || [],
      totalElements: data.pagination?.totalElements || 0,
    }),
    throwOnError: false, // 에러를 throw하지 않고 error 상태로 반환
  })

  if (result.data && result.data.totalElements > 0 && enabled) {
    const totalPages = Math.ceil(result.data.totalElements / params.pagination.size)
    const nextPage = (params.pagination.page + 1) as ApiPage

    if (nextPage < totalPages) {
      void queryClient.prefetchQuery({
        queryKey: [
          'products',
          {
            searchForm: params.searchForm,
            page: nextPage,
            size: params.pagination.size,
          },
        ],
        queryFn: async () => {
          const nextParams = {
            ...params,
            pagination: {
              ...params.pagination,
              page: nextPage,
            },
          }
          const queryString = buildProductQueryString(nextParams)
          return api.get<PagedApiResponse<Product>>(`/products${queryString}`)
        },
        staleTime: 1000 * 30,
      })
    }
  }

  return result
}

export type { ProductQueryData, ProductQueryParams }
