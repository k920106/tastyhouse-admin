'use client'

import { useCallback, useEffect } from 'react'
import { useProductSearchStore } from '@/src/store/productSearchStore'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { useProductsQuery } from './queries/useProductQueries'
import { toast } from 'sonner'

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
  handlePageChange: (page: number, size?: number) => void

  // 로딩 상태
  loading: boolean

  // 액션
  handleSearch: () => void
}

export const useProductSearchWithQuery = (): ProductSearchHookResult => {
  const { searchForm, currentPage, pageSize, updateSearchForm, updatePagination } =
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

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updatePagination(newPage, targetPageSize)
    },
    [updatePagination, pageSize],
  )

  const handleSearch = useCallback(() => {
    updatePagination(0, pageSize)
    refetch()
  }, [updatePagination, pageSize, refetch])

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
    handlePageChange,

    // 로딩 상태 및 에러
    loading: isLoading,

    // 액션
    handleSearch,
  }
}
