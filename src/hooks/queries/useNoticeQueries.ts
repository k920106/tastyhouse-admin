'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/api'
import { NoticeSearchForm, NoticeListItem } from '@/src/types/notice'
import { PagedApiResponse } from '@/src/types/api'
import { isEmptyValue } from '@/src/lib/validations/notice'

interface NoticeQueryParams {
  searchForm: NoticeSearchForm
  pagination: {
    page: number
    size: number
  }
}

interface NoticeQueryData {
  notices: NoticeListItem[]
  totalCount: number
}

const buildNoticeQueryString = (params: NoticeQueryParams): string => {
  const { searchForm, pagination } = params

  const requestData = {
    companyId: !isEmptyValue(searchForm.companyId) ? Number(searchForm.companyId) : undefined,
    title: searchForm.title || undefined,
    isUse: !isEmptyValue(searchForm.active) ? searchForm.active === 'true' : undefined,
    startDate: searchForm.startDate || undefined,
    endDate: searchForm.endDate || undefined,
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
      totalCount: data.pagination?.totalElements || 0,
    }),
    throwOnError: false, // 에러를 throw하지 않고 error 상태로 반환
  })
}
