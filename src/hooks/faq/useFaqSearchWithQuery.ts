'use client'

import { getInitialFaqSearchForm } from '@/src/constants/faq'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import {
  apiPageToUrlPage,
  toApiPage,
  type ApiPage,
  type UrlPage,
} from '@/src/lib/pagination-utils'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { FaqSearchFormInput, isFaqSearchKey } from '@/src/types/faq'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useFaqsQuery, type FaqQueryData } from '../queries/useFaqQueries'
import { usePaginationFromUrl } from '../usePaginationFromUrl'
import { useToastError } from '../useToastError'

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

  // URL 파싱 로직을 직접 처리 (중복 제거)
  const urlSearchForm = useMemo<FaqSearchFormInput>(() => {
    return parseSearchParamsToForm<FaqSearchFormInput>(
      searchParams,
      getInitialFaqSearchForm(),
      isFaqSearchKey,
    )
  }, [searchParams])

  const { currentPage, pageSize } = usePaginationFromUrl()

  const updateUrl = useCallback(
    (formOverride?: Partial<FaqSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize = size ?? pageSize

      const params = buildSearchParams(
        finalForm,
        initialSearchForm,
        targetPageForUrl,
        targetSize,
        isFaqSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, pageSize, urlSearchForm],
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
