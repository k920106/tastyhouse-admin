'use client'

import { getInitialProductSearchForm } from '@/src/constants/product'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { apiPageToUrlPage, toApiPage, type ApiPage, type UrlPage } from '@/src/lib/pagination-utils'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { ProductSearchFormInput, isProductSearchKey } from '@/src/types/product'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useProductsQuery, type ProductQueryData } from '../queries/useProductQueries'
import { usePaginationFromUrl } from '../usePaginationFromUrl'
import { useToastError } from '../useToastError'

export interface ProductSearchWithQueryHookResult {
  urlSearchForm: ProductSearchFormInput

  currentPage: ApiPage
  pageSize: number

  data: ProductQueryData | undefined
  isLoading: boolean

  updateUrl: (form?: Partial<ProductSearchFormInput> | null, page?: ApiPage, size?: number) => void
}

const initialSearchForm = getInitialProductSearchForm()

export const useProductSearchWithQuery = (): ProductSearchWithQueryHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // searchParams 자체가 이미 메모이제이션되어 있어 useMemo 불필요
  const urlSearchForm = parseSearchParamsToForm<ProductSearchFormInput>(
    searchParams,
    getInitialProductSearchForm(),
    isProductSearchKey,
  )

  const { currentPage, pageSize } = usePaginationFromUrl()

  const updateUrl = useCallback(
    (formOverride?: Partial<ProductSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize = size ?? pageSize

      const params = buildSearchParams(
        finalForm,
        initialSearchForm,
        targetPageForUrl,
        targetSize,
        isProductSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, pageSize, urlSearchForm],
  )

  // searchParams 자체가 이미 메모이제이션되어 있어 useMemo 불필요
  const hasSearchParams = searchParams.size > 0

  const { data, isLoading, error } = useProductsQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    hasSearchParams,
  )

  useToastError(error, '상품 목록 조회 중 오류가 발생했습니다.')

  return {
    urlSearchForm,

    currentPage,
    pageSize,

    data,
    isLoading,

    updateUrl,
  }
}
