import { api } from '@/src/lib/api'
import { PagedApiResponse } from '@/src/types/api'
import { NoticeListItem, NoticeSearchFormInput, convertFormToQuery } from '@/src/types/notice'
import { useQuery } from '@tanstack/react-query'

interface NoticeQueryParams {
  searchForm: NoticeSearchFormInput
  pagination: {
    page: number
    size: number
  }
}

interface NoticeQueryData {
  notices: NoticeListItem[]
  totalElements: number
}

/**
 * 검색 폼과 페이지네이션을 API 쿼리 스트링으로 변환
 * convertFormToQuery를 활용하여 타입 변환 로직 통일
 */
const buildNoticeQueryString = (params: NoticeQueryParams): string => {
  const { searchForm, pagination } = params

  // 검색 폼을 API 쿼리로 변환 (타입 변환 로직 통일)
  const searchQuery = convertFormToQuery(searchForm)

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
  return useQuery<PagedApiResponse<NoticeListItem>, Error, NoticeQueryData>({
    queryKey: ['notices', params],
    queryFn: async () => {
      const queryString = buildNoticeQueryString(params)
      return api.get<PagedApiResponse<NoticeListItem>>(`/notices${queryString}`)
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분으로 증가
    gcTime: 1000 * 60 * 10, // 10분 가비지 컬렉션
    select: (data): NoticeQueryData => ({
      notices: data.data || [],
      totalElements: data.pagination?.totalElements || 0,
    }),
    throwOnError: false, // 에러를 throw하지 않고 error 상태로 반환
  })
}

export type { NoticeQueryData, NoticeQueryParams }
