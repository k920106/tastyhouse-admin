'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'
import { useProductsQuery } from './queries/useProductQueries'
import { toast } from 'sonner'
import { INITIAL_PAGINATION } from '@/src/lib/constants'

const INITIAL_SEARCH_FORM: ProductSearchForm = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  display: 'all',
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
  handlePageChange: (page: number, size: number) => void

  // 액션
  handleSearch: () => void
}

// URL 쿼리 파라미터 -> ProductSearchForm 변환
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

// ProductSearchForm -> URL 쿼리 파라미터 변환
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

  // 쿼리 스트링이 없을 경우 필터 초기화
  useEffect(() => {
    const hasQueryParams = Array.from(searchParams.keys()).length > 0
    if (!hasQueryParams) {
      setLocalSearchForm(INITIAL_SEARCH_FORM)
    }
  }, [searchParams])

  // 쿼리 파라미터가 존재할 때만 검색 실행
  const shouldExecuteQuery = useMemo(() => {
    return Array.from(searchParams.keys()).length > 0
  }, [searchParams])

  // URL에서 실제 검색에 사용될 상태 파싱 (검색 버튼 클릭 시만 업데이트됨)
  const urlSearchForm: ProductSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams),
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

  const { products, totalCount, isLoading, error } = useProductsQuery(
    {
      searchForm: urlSearchForm,
      currentPage,
      pageSize,
    },
    shouldExecuteQuery,
  )

  useEffect(() => {
    if (error) {
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  // 입력) Input, Select ...
  const updateSearchForm = useCallback((updates: Partial<ProductSearchForm>) => {
    // 로컬 상태만 업데이트, URL은 변경하지 않음
    setLocalSearchForm((prev) => ({ ...prev, ...updates }))
  }, [])

  // 버튼) 검색
  const handleSearch = useCallback(() => {
    // 매체사 필수 선택 검증
    if (
      !localSearchForm.companyId ||
      localSearchForm.companyId === 'all' ||
      localSearchForm.companyId === ''
    ) {
      toast.error('매체사를 선택해 주세요')
      return
    }

    // 로컬 검색 폼을 URL에 반영하면서 검색 실행 (첫 페이지로 이동)
    const params = buildSearchParams(localSearchForm, 0, pageSize)
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(url, { scroll: false })
  }, [localSearchForm, pageSize, router])

  // 페이지네이션
  const updatePagination = useCallback(
    (page: number, size: number) => {
      const params = buildSearchParams(urlSearchForm, page, size)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [urlSearchForm, router],
  )

  // 페이지네이션
  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updatePagination(newPage, targetPageSize)
    },
    [updatePagination, pageSize],
  )

  return {
    // 검색 폼 (로컬 상태 반환)
    searchForm: localSearchForm,
    updateSearchForm,

    // 상품 데이터 관련
    products,

    // 페이지네이션 관련
    totalCount,
    currentPage,
    pageSize,
    handlePageChange,

    // 로딩 상태 및 에러
    loading: isLoading,

    // 액션
    handleSearch,
  }
}
