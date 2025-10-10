import { api } from '@/src/lib/api'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { noticeSearchQuerySchema } from '@/src/lib/schemas/notice-schema'
import { PagedApiResponse } from '@/src/types/api'
import { Notice, NoticeSearchFormInput } from '@/src/types/notice'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface NoticeQueryParams {
  searchForm: NoticeSearchFormInput
  pagination: {
    page: ApiPage
    size: number
  }
}

interface NoticeQueryData {
  notices: Notice[]
  totalElements: number
}

const buildNoticeQueryString = (params: NoticeQueryParams): string => {
  const { searchForm, pagination } = params

  const searchQuery = noticeSearchQuerySchema.parse(searchForm)

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

export const useNoticesQuery = (params: NoticeQueryParams, enabled = true) => {
  const queryClient = useQueryClient()

  const result = useQuery<PagedApiResponse<Notice>, Error, NoticeQueryData>({
    queryKey: [
      'notices',
      {
        searchForm: params.searchForm,
        page: params.pagination.page,
        size: params.pagination.size,
      },
    ],
    queryFn: async () => {
      const queryString = buildNoticeQueryString(params)
      return api.get<PagedApiResponse<Notice>>(`/notices${queryString}`)
    },
    enabled,
    staleTime: 1000 * 30, // 30초로 축소 (실시간성 향상)
    gcTime: 1000 * 60 * 5, // 5분으로 축소 (메모리 효율성)
    select: (data): NoticeQueryData => ({
      notices: data.data || [],
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
          'notices',
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
          const queryString = buildNoticeQueryString(nextParams)
          return api.get<PagedApiResponse<Notice>>(`/notices${queryString}`)
        },
        staleTime: 1000 * 30,
      })
    }
  }

  return result
}

export type { NoticeQueryData, NoticeQueryParams }
