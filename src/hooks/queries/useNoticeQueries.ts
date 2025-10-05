import { api } from '@/src/lib/api'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { PagedApiResponse } from '@/src/types/api'
import { NoticeListItem, NoticeSearchFormInput } from '@/src/types/notice'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { noticeSearchQuerySchema } from '../notice/useNoticeSearchForm'

interface NoticeQueryParams {
  searchForm: NoticeSearchFormInput
  pagination: {
    page: ApiPage
    size: number
  }
}

interface NoticeQueryData {
  notices: NoticeListItem[]
  totalElements: number
}

/**
 * 검색 폼과 페이지네이션을 API 쿼리 스트링으로 변환
 * Zod 스키마를 활용하여 타입 변환 로직 통일 및 검증
 */
const buildNoticeQueryString = (params: NoticeQueryParams): string => {
  const { searchForm, pagination } = params

  // Zod 스키마로 Form → Query 변환 (타입 안전성 보장)
  const searchQuery = noticeSearchQuerySchema.parse(searchForm)

  // 페이지네이션 파라미터 추가
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

  const result = useQuery<PagedApiResponse<NoticeListItem>, Error, NoticeQueryData>({
    // 검색 조건별 세밀한 캐싱을 위한 구조화된 queryKey
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
      return api.get<PagedApiResponse<NoticeListItem>>(`/notices${queryString}`)
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

  // Prefetching: 다음 페이지를 미리 로드하여 UX 향상
  // 현재 쿼리가 성공했고 데이터가 있을 때만 실행
  if (result.data && result.data.totalElements > 0 && enabled) {
    const totalPages = Math.ceil(result.data.totalElements / params.pagination.size)
    const nextPage = (params.pagination.page + 1) as ApiPage

    // 다음 페이지가 존재하면 prefetch
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
          return api.get<PagedApiResponse<NoticeListItem>>(`/notices${queryString}`)
        },
        staleTime: 1000 * 30,
      })
    }
  }

  return result
}

export type { NoticeQueryData, NoticeQueryParams }
