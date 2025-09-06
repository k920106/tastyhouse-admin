'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

// URL 쿼리 파라미터를 ProductSearchForm으로 변환
const parseSearchParamsToForm = (searchParams: URLSearchParams): ProductSearchForm => {
  return {
    companyId: searchParams.get('companyId') || INITIAL_SEARCH_FORM.companyId,
    productCode: searchParams.get('productCode') || INITIAL_SEARCH_FORM.productCode,
    name: searchParams.get('name') || INITIAL_SEARCH_FORM.name,
    brandId: searchParams.get('brandId') || INITIAL_SEARCH_FORM.brandId,
    supplyId: searchParams.get('supplyId') || INITIAL_SEARCH_FORM.supplyId,
    display: searchParams.get('display') || INITIAL_SEARCH_FORM.display,
  }
}

// ProductSearchForm을 URL 쿼리 파라미터로 변환
const buildSearchParams = (
  form: ProductSearchForm,
  currentPage: number,
  pageSize: number,
): URLSearchParams => {
  const params = new URLSearchParams()

  // 검색 폼 파라미터 추가 (초기값과 다른 경우만)
  Object.entries(form).forEach(([key, value]) => {
    if (value && value !== INITIAL_SEARCH_FORM[key as keyof ProductSearchForm]) {
      params.set(key, value)
    }
  })

  // 페이지네이션 파라미터 추가 (초기값과 다른 경우만)
  if (currentPage !== INITIAL_PAGINATION.currentPage) {
    params.set('page', currentPage.toString())
  }
  if (pageSize !== INITIAL_PAGINATION.pageSize) {
    params.set('pageSize', pageSize.toString())
  }

  return params
}

export const useProductSearchWithQuery = (): ProductSearchHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 로컬 상태로 검색 폼 관리 (URL과 분리)
  const [localSearchForm, setLocalSearchForm] = useState<ProductSearchForm>(() =>
    parseSearchParamsToForm(searchParams),
  )

  // URL에서 실제 검색에 사용될 상태 파싱 (검색 버튼 클릭 시만 업데이트됨)
  const urlSearchForm = useMemo(() => parseSearchParamsToForm(searchParams), [searchParams])
  const currentPage = useMemo(
    () => parseInt(searchParams.get('page') || INITIAL_PAGINATION.currentPage.toString()),
    [searchParams],
  )
  const pageSize = useMemo(
    () => parseInt(searchParams.get('pageSize') || INITIAL_PAGINATION.pageSize.toString()),
    [searchParams],
  )

  // 검색 실행 여부를 제어하는 상태
  const shouldExecuteQuery = useMemo(() => {
    // 매체사가 선택되어야 쿼리 실행 가능
    const companyId = searchParams.get('companyId')
    const hasValidCompany = companyId && companyId !== 'all' && companyId !== ''

    if (!hasValidCompany) {
      return false
    }

    // 매체사가 선택된 상태에서 페이지 파라미터가 있거나 다른 검색 조건이 있으면 쿼리 실행
    const hasPageParams = searchParams.has('page') || searchParams.has('pageSize')
    const otherSearchKeys = ['productCode', 'name', 'brandId', 'supplyId', 'display']
    const hasOtherSearchParams = otherSearchKeys.some(key => {
      const value = searchParams.get(key)
      return value && value !== '' && value !== 'all'
    })

    return hasPageParams || hasOtherSearchParams || hasValidCompany
  }, [searchParams])

  // URL이 변경될 때 로컬 상태도 동기화 (브라우저 뒤로가기/앞으로가기 대응)
  useEffect(() => {
    setLocalSearchForm(parseSearchParamsToForm(searchParams))
  }, [searchParams])

  const {
    data: productResponse,
    isLoading,
    error,
  } = useProductsQuery({
    searchForm: urlSearchForm, // URL의 검색 폼 사용 (실제 검색에 사용)
    currentPage,
    pageSize,
  }, shouldExecuteQuery)

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch products:', error)
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  // URL 업데이트 헬퍼 함수
  const updateURL = useCallback(
    (newForm: ProductSearchForm, newPage: number, newPageSize: number) => {
      const params = buildSearchParams(newForm, newPage, newPageSize)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router],
  )

  // 편의 함수들 - 비즈니스 로직을 hook에서 관리
  const updateSearchForm = useCallback(
    (updates: Partial<ProductSearchForm>) => {
      // 로컬 상태만 업데이트, URL은 변경하지 않음
      setLocalSearchForm(prev => ({ ...prev, ...updates }))
    },
    [],
  )

  const updatePage = useCallback(
    (page: number) => {
      const params = buildSearchParams(urlSearchForm, page, pageSize)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [urlSearchForm, pageSize, router],
  )

  const updatePageSize = useCallback(
    (size: number) => {
      const params = buildSearchParams(urlSearchForm, 0, size)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [urlSearchForm, router],
  )

  const updatePagination = useCallback(
    (page: number, size: number) => {
      const params = buildSearchParams(urlSearchForm, page, size)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [urlSearchForm, router],
  )

  const resetSearchForm = useCallback(() => {
    setLocalSearchForm(INITIAL_SEARCH_FORM)
  }, [])

  const resetPagination = useCallback(() => {
    updateURL(urlSearchForm, INITIAL_PAGINATION.currentPage, INITIAL_PAGINATION.pageSize)
  }, [urlSearchForm, updateURL])

  const reset = useCallback(() => {
    setLocalSearchForm(INITIAL_SEARCH_FORM)
    updateURL(INITIAL_SEARCH_FORM, INITIAL_PAGINATION.currentPage, INITIAL_PAGINATION.pageSize)
  }, [updateURL])

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updatePagination(newPage, targetPageSize)
    },
    [updatePagination, pageSize],
  )

  const handleSearch = useCallback(() => {
    // 매체사 필수 선택 검증
    if (!localSearchForm.companyId || localSearchForm.companyId === 'all' || localSearchForm.companyId === '') {
      toast.error('매체사를 선택해 주세요')
      return
    }

    // 로컬 검색 폼을 URL에 반영하면서 검색 실행 (첫 페이지로 이동)
    const params = buildSearchParams(localSearchForm, 0, pageSize)
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(url, { scroll: false })
  }, [localSearchForm, pageSize, router])

  return {
    // 검색 폼 (로컬 상태 반환)
    searchForm: localSearchForm,
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
