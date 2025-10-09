import { api } from '@/src/lib/api'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { faqSearchQuerySchema } from '@/src/lib/schemas/faq-schema'
import { PagedApiResponse } from '@/src/types/api'
import { Faq, FaqSearchFormInput } from '@/src/types/faq'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface FaqQueryParams {
  searchForm: FaqSearchFormInput
  pagination: {
    page: ApiPage
    size: number
  }
}

interface FaqQueryData {
  faqs: Faq[]
  totalElements: number
}

const buildFaqQueryString = (params: FaqQueryParams): string => {
  const { searchForm, pagination } = params

  const searchQuery = faqSearchQuerySchema.parse(searchForm)

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

export const useFaqsQuery = (params: FaqQueryParams, enabled = true) => {
  const queryClient = useQueryClient()

  const result = useQuery<PagedApiResponse<Faq>, Error, FaqQueryData>({
    queryKey: [
      'faqs',
      {
        searchForm: params.searchForm,
        page: params.pagination.page,
        size: params.pagination.size,
      },
    ],
    queryFn: async () => {
      const queryString = buildFaqQueryString(params)
      return api.get<PagedApiResponse<Faq>>(`/faqs${queryString}`)
    },
    enabled,
    staleTime: 1000 * 30, // 30초로 축소 (실시간성 향상)
    gcTime: 1000 * 60 * 5, // 5분으로 축소 (메모리 효율성)
    select: (data): FaqQueryData => ({
      faqs: data.data || [],
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
          'faqs',
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
          const queryString = buildFaqQueryString(nextParams)
          return api.get<PagedApiResponse<Faq>>(`/faqs${queryString}`)
        },
        staleTime: 1000 * 30,
      })
    }
  }

  return result
}

export type { FaqQueryData, FaqQueryParams }
