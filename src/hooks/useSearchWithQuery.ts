'use client'

import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { apiPageToUrlPage, toApiPage, type ApiPage, type UrlPage } from '@/src/lib/pagination-utils'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { usePaginationFromUrl } from './usePaginationFromUrl'
import { useToastError } from './useToastError'

export interface UseSearchWithQueryOptions<TSearchForm extends Record<string, unknown>, TData> {
  /** 초기 검색 폼 값을 반환하는 함수 */
  getInitialForm: () => TSearchForm
  /** 검색 파라미터 키 검증 함수 */
  isSearchKey: (key: string) => boolean
  /** React Query 훅 */
  useQuery: (params: {
    searchForm: TSearchForm
    pagination: { page: ApiPage; size: number }
  }, enabled: boolean) => {
    data: TData | undefined
    isLoading: boolean
    error: Error | null
  }
  /** 에러 메시지 */
  errorMessage: string
}

export interface SearchWithQueryHookResult<TSearchForm, TData> {
  urlSearchForm: TSearchForm

  currentPage: ApiPage
  pageSize: number

  data: TData | undefined
  isLoading: boolean

  updateUrl: (form?: Partial<TSearchForm> | null, page?: ApiPage, size?: number) => void
}

/**
 * URL 쿼리 파라미터와 검색 폼을 동기화하는 공통 훅
 *
 * @template TSearchForm - 검색 폼 타입
 * @template TData - 쿼리 결과 데이터 타입
 */
export const useSearchWithQuery = <TSearchForm extends Record<string, unknown>, TData>({
  getInitialForm,
  isSearchKey,
  useQuery,
  errorMessage,
}: UseSearchWithQueryOptions<TSearchForm, TData>): SearchWithQueryHookResult<TSearchForm, TData> => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialSearchForm = getInitialForm()

  // searchParams 자체가 이미 메모이제이션되어 있어 useMemo 불필요
  const urlSearchForm = parseSearchParamsToForm<TSearchForm>(
    searchParams,
    getInitialForm(),
    isSearchKey,
  )

  const { currentPage, pageSize } = usePaginationFromUrl()

  const updateUrl = useCallback(
    (formOverride?: Partial<TSearchForm> | null, page?: ApiPage, size?: number) => {
      const finalForm = formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize = size ?? pageSize

      const params = buildSearchParams(
        finalForm,
        initialSearchForm,
        targetPageForUrl,
        targetSize,
        isSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, pageSize, urlSearchForm, initialSearchForm, isSearchKey],
  )

  const { data, isLoading, error } = useQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    searchParams.size > 0,
  )

  useToastError(error, errorMessage)

  return {
    urlSearchForm,

    currentPage,
    pageSize,

    data,
    isLoading,

    updateUrl,
  }
}
