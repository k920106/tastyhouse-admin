'use client'

import { getInitialProductSearchForm } from '@/src/constants/product'
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
import { ProductSearchFormInput, isProductSearchKey } from '@/src/types/product'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useProductsQuery, type ProductQueryData } from '../queries/useProductQueries'
import { useToastError } from '../useToastError'
import { useProductUrlSearchForm } from './useProductSearchForm'

const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

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

  const urlSearchForm = useProductUrlSearchForm()

  const currentPage: ApiPage = useMemo(() => {
    const pageFromUrl = parseIntSafely(searchParams.get('page'), 1)
    return urlPageToApiPage(toUrlPage(pageFromUrl))
  }, [searchParams])

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  const updateUrl = useCallback(
    (formOverride?: Partial<ProductSearchFormInput> | null, page?: ApiPage, size?: number) => {
      const finalForm = (
        formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm
      ) as ProductSearchFormInput

      const targetPage: ApiPage = page ?? toApiPage(INITIAL_PAGINATION.currentPage)
      const targetPageForUrl: UrlPage = apiPageToUrlPage(targetPage)

      const targetSize =
        size ?? parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize)

      const params = buildSearchParams(
        finalForm as unknown as Record<string, unknown>,
        initialSearchForm as unknown as Record<string, unknown>,
        targetPageForUrl,
        targetSize,
        isProductSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, searchParams, urlSearchForm],
  )

  const hasSearchParams = useMemo(() => searchParams.size > 0, [searchParams])

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
