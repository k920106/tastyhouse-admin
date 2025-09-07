'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchForm } from '@/src/types/product'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { parseSearchParamsToForm, buildSearchParams } from '@/src/lib/url-utils'
import { INITIAL_PRODUCT_SEARCH_FORM } from '@/src/constants/product'

const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

export interface ProductPaginationHookResult {
  currentPage: number
  pageSize: number
  handlePageChange: (page: number, pageSize?: number) => void
}

export const useProductPagination = (): ProductPaginationHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 페이지네이션 정보
  const currentPage = useMemo(
    () => parseIntSafely(searchParams.get('page'), INITIAL_PAGINATION.currentPage),
    [searchParams],
  )

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  // 현재 URL의 검색 조건
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    [searchParams],
  )

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (form: ProductSearchForm, page: number, size: number) => {
      const params = buildSearchParams(form, INITIAL_PRODUCT_SEARCH_FORM, page, size)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router],
  )

  // 페이지네이션 핸들러
  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      // 현재 URL의 검색 조건을 유지하면서 페이지만 변경
      updateUrl(urlSearchForm, newPage, targetPageSize)
    },
    [urlSearchForm, pageSize, updateUrl],
  )

  return {
    currentPage,
    pageSize,
    handlePageChange,
  }
}
