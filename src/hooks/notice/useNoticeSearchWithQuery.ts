'use client'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import {
  apiPageToUrlPage,
  toApiPage,
  toUrlPage,
  urlPageToApiPage,
  type ApiPage,
  type UrlPage,
} from '@/src/lib/pagination-utils'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { NoticeSearchFormInput, isNoticeSearchKey } from '@/src/types/notice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useNoticesQuery, type NoticeQueryData } from '../queries/useNoticeQueries'
import { useToastError } from '../useToastError'

const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

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

  // URL 파싱 로직을 직접 처리 (중복 제거)
  const urlSearchForm = useMemo(() => {
    const initialForm = getInitialNoticeSearchForm()
    return parseSearchParamsToForm(
      searchParams,
      initialForm as unknown as Record<string, unknown>,
      isNoticeSearchKey,
    ) as unknown as NoticeSearchFormInput
  }, [searchParams])

  const currentPage: ApiPage = useMemo(() => {
    const pageFromUrl = parseIntSafely(searchParams.get('page'), 1)
    return urlPageToApiPage(toUrlPage(pageFromUrl))
  }, [searchParams])

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  const updateUrl = useCallback(
    (formOverride?: Partial<NoticeSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = (
        formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm
      ) as NoticeSearchFormInput

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize =
        size ?? parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize)

      const params = buildSearchParams(
        finalForm as unknown as Record<string, unknown>,
        initialSearchForm as unknown as Record<string, unknown>,
        targetPageForUrl,
        targetSize,
        isNoticeSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, searchParams, urlSearchForm],
  )

  const hasSearchParams = useMemo(() => searchParams.size > 0, [searchParams])

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
