'use client'

import { useCallback, useEffect } from 'react'
import { useProductSearchStore } from '@/src/store/productSearchStore'
import { ProductSearchForm, ProductListItem, INITIAL_SEARCH_FORM } from '@/src/types/product'
import { useProductsQuery } from './queries/useProductQueries'
import { toast } from 'sonner'
import { INITIAL_PAGINATION } from '@/src/lib/constants'

export interface ProductSearchHookResult {
  // 검색 폼 관련
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void

  // 상품 데이터 관련
  products: ProductListItem[]

  // 페이지네이션 관련
  totalCount: number
  currentPage: number
  pageSize: number
  updatePage: (page: number) => void
  updatePageSize: (size: number) => void
  updatePagination: (page: number, size: number) => void
  handlePageChange: (page: number, size?: number) => void

  // 로딩 상태
  loading: boolean

  // 액션
  handleSearch: () => void
  resetSearchForm: () => void
  resetPagination: () => void
  reset: () => void
}

export const useProductSearchWithQuery = (): ProductSearchHookResult => {
  const { searchForm, currentPage, pageSize, setSearchForm, setCurrentPage, setPageSize } =
    useProductSearchStore()

  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useProductsQuery({
    searchForm,
    currentPage,
    pageSize,
  })

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch products:', error)
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  // 편의 함수들 - 비즈니스 로직을 hook에서 관리
  const updateSearchForm = useCallback(
    (updates: Partial<ProductSearchForm>) => {
      setSearchForm({ ...searchForm, ...updates })
    },
    [searchForm, setSearchForm],
  )

  const updatePage = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  const updatePageSize = useCallback(
    (size: number) => {
      setPageSize(size)
      setCurrentPage(0) // 페이지 크기 변경 시 첫 페이지로
    },
    [setPageSize, setCurrentPage],
  )

  const updatePagination = useCallback(
    (page: number, size: number) => {
      setCurrentPage(page)
      setPageSize(size)
    },
    [setCurrentPage, setPageSize],
  )

  const resetSearchForm = useCallback(() => {
    setSearchForm(INITIAL_SEARCH_FORM)
  }, [setSearchForm])

  const resetPagination = useCallback(() => {
    setCurrentPage(INITIAL_PAGINATION.currentPage)
    setPageSize(INITIAL_PAGINATION.pageSize)
  }, [setCurrentPage, setPageSize])

  const reset = useCallback(() => {
    setSearchForm(INITIAL_SEARCH_FORM)
    setCurrentPage(INITIAL_PAGINATION.currentPage)
    setPageSize(INITIAL_PAGINATION.pageSize)
  }, [setSearchForm, setCurrentPage, setPageSize])

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updatePagination(newPage, targetPageSize)
    },
    [updatePagination, pageSize],
  )

  const handleSearch = useCallback(() => {
    setCurrentPage(0)
    refetch()
  }, [setCurrentPage, refetch])

  return {
    // 검색 폼
    searchForm,
    updateSearchForm,

    // 상품 데이터 관련
    products: productResponse?.data || [],

    // 페이지네이션 관련
    totalCount: productResponse?.pagination?.total || 0,
    currentPage,
    pageSize,
    updatePage,
    updatePageSize,
    updatePagination,
    handlePageChange,

    // 로딩 상태 및 에러
    loading: isLoading,

    // 액션
    handleSearch,
    resetSearchForm,
    resetPagination,
    reset,
  }
}
