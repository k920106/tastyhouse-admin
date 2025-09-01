'use client'

import { useCallback, useState } from 'react'
import { useProductSearchStore } from '@/src/store/productSearchStore'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { DataTablesResponse } from '@/src/types/api'
import { api } from '@/src/lib/api'
import { toast } from 'sonner'

export interface ProductSearchHookResult {
  // 검색 폼 관련
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void
  resetSearchForm: () => void

  // 상품 데이터 관련
  products: ProductListItem[]
  totalCount: number

  // 페이지네이션 관련
  currentPage: number
  pageSize: number
  handlePageChange: (page: number, size?: number) => void

  // 로딩 상태
  loading: boolean

  // 액션
  handleSearch: () => Promise<void>
}

export const useProductSearch = (): ProductSearchHookResult => {
  const store = useProductSearchStore()
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(
    async (page: number = store.currentPage, size: number = store.pageSize) => {
      setLoading(true)

      try {
        const requestData = {
          companyId:
            store.searchForm.companyId && store.searchForm.companyId !== 'all'
              ? Number(store.searchForm.companyId)
              : undefined,
          brandId:
            store.searchForm.brandId && store.searchForm.brandId !== 'all'
              ? Number(store.searchForm.brandId)
              : undefined,
          supplyId:
            store.searchForm.supplyId && store.searchForm.supplyId !== 'all'
              ? Number(store.searchForm.supplyId)
              : undefined,
          display:
            store.searchForm.display && store.searchForm.display !== 'all'
              ? store.searchForm.display === 'true'
              : undefined,
          productCode: store.searchForm.productCode || undefined,
          name: store.searchForm.name || undefined,
          page,
          size,
          draw: 1,
        }

        const queryParams = new URLSearchParams()
        Object.entries(requestData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value))
          }
        })

        const endpoint = queryParams.toString()
          ? `/products?${queryParams.toString()}`
          : '/products'
        const response = await api.get<DataTablesResponse<ProductListItem>>(endpoint)

        store.setProductsData(response.data, response.pagination, page, size)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('오류가 발생하였습니다.')
      } finally {
        setLoading(false)
      }
    },
    [store, setLoading],
  )

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? store.pageSize
      store.updatePagination(newPage, targetPageSize)
      fetchProducts(newPage, targetPageSize)
    },
    [store, fetchProducts],
  )

  const handleSearch = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  return {
    // 검색 폼 관련
    searchForm: store.searchForm,
    updateSearchForm: store.updateSearchForm,
    resetSearchForm: store.resetSearchForm,

    // 상품 데이터 관련
    products: store.products,
    totalCount: store.totalCount,

    // 페이지네이션 관련
    currentPage: store.currentPage,
    pageSize: store.pageSize,
    handlePageChange,

    // 로딩 상태
    loading,

    // 액션
    handleSearch,
  }
}
