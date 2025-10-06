'use client'

import { getInitialFaqSearchForm } from '@/src/constants/faq'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import {
  apiPageToUrlPage,
  toApiPage,
  toUrlPage,
  urlPageToApiPage,
  type ApiPage,
  type UrlPage,
} from '@/src/lib/pagination-utils'
import { buildSearchParams } from '@/src/lib/url-utils'
import { FaqSearchFormInput, isFaqSearchKey } from '@/src/types/faq'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useFaqsQuery, type FaqQueryData } from '../queries/useFaqQueries'
import { useToastError } from '../useToastError'
import { useFaqUrlSearchForm } from './useFaqSearchForm'

const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

export interface FaqSearchWithQueryHookResult {
  urlSearchForm: FaqSearchFormInput

  currentPage: ApiPage
  pageSize: number

  data: FaqQueryData | undefined
  isLoading: boolean

  updateUrl: (form?: Partial<FaqSearchFormInput> | null, page?: ApiPage, size?: number) => void
}

const initialSearchForm = getInitialFaqSearchForm()

export const useFaqSearchWithQuery = (): FaqSearchWithQueryHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlSearchForm = useFaqUrlSearchForm()

  const currentPage: ApiPage = useMemo(() => {
    const pageFromUrl = parseIntSafely(searchParams.get('page'), 1)
    return urlPageToApiPage(toUrlPage(pageFromUrl))
  }, [searchParams])

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  const updateUrl = useCallback(
    (formOverride?: Partial<FaqSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = (
        formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm
      ) as FaqSearchFormInput

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize =
        size ?? parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize)

      const params = buildSearchParams(
        finalForm as unknown as Record<string, unknown>,
        initialSearchForm as unknown as Record<string, unknown>,
        targetPageForUrl,
        targetSize,
        isFaqSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, searchParams, urlSearchForm],
  )

  const hasSearchParams = useMemo(() => searchParams.size > 0, [searchParams])

  const { data, isLoading, error } = useFaqsQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    hasSearchParams,
  )

  useToastError(error, 'FAQ 목록 조회 중 오류가 발생했습니다.')

  return {
    urlSearchForm,

    currentPage,
    pageSize,

    data,
    isLoading,

    updateUrl,
  }
}
