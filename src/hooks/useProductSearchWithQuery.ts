'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { useProductsQuery } from './queries/useProductQueries'
import { toast } from 'sonner'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { parseSearchParamsToForm, buildSearchParams } from '@/src/lib/url-utils'
import { INITIAL_PRODUCT_SEARCH_FORM } from '@/src/constants/product'
import { validateProductSearchForm } from '@/src/lib/validations/product'

// 유틸리티 함수
const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

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

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 모든 검색 폼 필드를 로컬 상태로 관리 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [searchForm, setSearchForm] = useState<ProductSearchForm>(initialSearchForm)

  // URL에서 현재 검색 조건 파싱 (실제 쿼리 실행용)
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    [searchParams],
  )

  // 페이지네이션 정보
  const currentPage = useMemo(
    () => parseIntSafely(searchParams.get('page'), INITIAL_PAGINATION.currentPage),
    [searchParams],
  )

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  // 검색 버튼 클릭 시에만 쿼리 실행
  const shouldExecuteQuery = useMemo(() => {
    return searchParams.size > 0
  }, [searchParams])

  // 데이터 조회 (URL 상태 기반)
  const { data, isLoading, error } = useProductsQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    shouldExecuteQuery,
  )

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error('상품 목록 조회 실패:', error)
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (form: ProductSearchForm, page: number = 0, size: number = pageSize) => {
      const params = buildSearchParams(form, INITIAL_PRODUCT_SEARCH_FORM, page, size)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [pageSize, router],
  )

  // 검색 폼 업데이트
  const updateSearchForm = useCallback((updates: Partial<ProductSearchForm>) => {
    setSearchForm(
      (prev) =>
        ({
          ...prev,
          ...Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined)),
        }) as ProductSearchForm,
    )
  }, [])

  // 검색 실행
  const handleSearch = useCallback(() => {
    const validation = validateProductSearchForm(searchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행
    updateUrl(searchForm, 0)
  }, [searchForm, updateUrl])

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
    // 검색 폼 (로컬 상태)
    searchForm,
    updateSearchForm,

    // 상품 데이터
    products: data?.products || [],

    // 페이지네이션
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
