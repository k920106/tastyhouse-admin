'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { useProductsQuery } from './queries/useProductQueries'
import { toast } from 'sonner'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { parseSearchParamsToForm, buildSearchParams } from '@/src/lib/url-utils'
import { INITIAL_PRODUCT_SEARCH_FORM } from '@/src/constants/product'
import { validateProductSearchForm } from '@/src/lib/validations/product'

export interface ProductSearchHookResult {
  // 로딩 상태
  loading: boolean

  // 상품 데이터 관련
  products: ProductListItem[]

  // 검색 폼 관련
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void

  // 페이지네이션 관련
  totalCount: number
  currentPage: number
  pageSize: number
  handlePageChange: (page: number, pageSize?: number) => void

  // 액션
  handleSearch: () => void

  // 에러 상태
  error: Error | null
}

export const useProductSearchWithQuery = (): ProductSearchHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL을 단일 진실 소스로 사용
  const searchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    [searchParams],
  )

  const currentPage = useMemo(
    () => parseInt(searchParams.get('page') || INITIAL_PAGINATION.currentPage.toString()),
    [searchParams],
  )

  const pageSize = useMemo(
    () => parseInt(searchParams.get('pageSize') || INITIAL_PAGINATION.pageSize.toString()),
    [searchParams],
  )

  // 쿼리 파라미터가 존재할 때만 검색 실행
  const shouldExecuteQuery = useMemo(() => {
    const keys = searchParams.keys()
    return Array.from(keys).length > 0
  }, [searchParams])

  const { data, isLoading, error } = useProductsQuery(
    {
      searchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    shouldExecuteQuery,
  )

  useEffect(() => {
    if (error) {
      console.error('상품 목록 조회 실패:', error)
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  // 검색 폼 업데이트 (URL 즉시 반영)
  const updateSearchForm = useCallback(
    (updates: Partial<ProductSearchForm>) => {
      const newSearchForm = { ...searchForm, ...updates }
      const params = buildSearchParams(newSearchForm, INITIAL_PRODUCT_SEARCH_FORM, 0, pageSize)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [searchForm, pageSize, router],
  )

  // 검색 실행 (검증 포함)
  const handleSearch = useCallback(() => {
    const validation = validateProductSearchForm(searchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 실행 (첫 페이지로 이동)
    const params = buildSearchParams(searchForm, INITIAL_PRODUCT_SEARCH_FORM, 0, pageSize)
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(url, { scroll: false })
  }, [searchForm, pageSize, router])

  // 페이지네이션 핸들러 (통합)
  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      const params = buildSearchParams(searchForm, INITIAL_PRODUCT_SEARCH_FORM, newPage, targetPageSize)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [searchForm, pageSize, router],
  )

  return {
    // 검색 폼
    searchForm,
    updateSearchForm,

    // 상품 데이터 관련
    products: data?.products || [],

    // 페이지네이션 관련
    totalCount: data?.totalCount || 0,
    currentPage,
    pageSize,
    handlePageChange,

    // 로딩 상태 및 에러
    loading: isLoading,
    error,

    // 액션
    handleSearch,
  }
}
