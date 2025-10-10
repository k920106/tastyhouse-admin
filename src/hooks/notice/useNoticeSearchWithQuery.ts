'use client'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { apiPageToUrlPage, toApiPage, type ApiPage, type UrlPage } from '@/src/lib/pagination-utils'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { NoticeSearchFormInput, isNoticeSearchKey } from '@/src/types/notice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useNoticesQuery, type NoticeQueryData } from '../queries/useNoticeQueries'
import { usePaginationFromUrl } from '../usePaginationFromUrl'
import { useToastError } from '../useToastError'

export interface NoticeSearchWithQueryHookResult {
  urlSearchForm: NoticeSearchFormInput

  currentPage: ApiPage
  pageSize: number

  data: NoticeQueryData | undefined
  isLoading: boolean

  updateUrl: (form?: Partial<NoticeSearchFormInput> | null, page?: ApiPage, size?: number) => void
}

const initialSearchForm = getInitialNoticeSearchForm()

export const useNoticeSearchWithQuery = (): NoticeSearchWithQueryHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // searchParams 자체가 이미 메모이제이션되어 있어 useMemo 불필요
  const urlSearchForm = parseSearchParamsToForm<NoticeSearchFormInput>(
    searchParams,
    getInitialNoticeSearchForm(),
    isNoticeSearchKey,
  )

  const { currentPage, pageSize } = usePaginationFromUrl()

  const updateUrl = useCallback(
    (formOverride?: Partial<NoticeSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize = size ?? pageSize

      const params = buildSearchParams(
        finalForm,
        initialSearchForm,
        targetPageForUrl,
        targetSize,
        isNoticeSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, pageSize, urlSearchForm],
  )

  // searchParams 자체가 이미 메모이제이션되어 있어 useMemo 불필요
  const hasSearchParams = searchParams.size > 0

  const { data, isLoading, error } = useNoticesQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    hasSearchParams,
  )

  useToastError(error, '공지사항 목록 조회 중 오류가 발생했습니다.')

  return {
    urlSearchForm,

    currentPage,
    pageSize,

    data,
    isLoading,

    updateUrl,
  }
}
