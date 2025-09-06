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

export interface ProductSearchHookResult {
  // 로딩 상태
  loading: boolean

  // 상품 데이터 관련
  products: ProductListItem[]

  // 검색 폼 관련
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void
  updateSearchFormImmediate: (updates: Partial<ProductSearchForm>) => void

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
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    [searchParams],
  )

  // Input 필드의 로컬 상태 (검색 버튼 클릭 전까지 URL에 반영 안됨)
  const [localInputs, setLocalInputs] = useState({
    productCode: urlSearchForm.productCode || '',
    name: urlSearchForm.name || '',
  })

  // URL 변경 시 로컬 상태도 동기화
  useEffect(() => {
    setLocalInputs({
      productCode: urlSearchForm.productCode || '',
      name: urlSearchForm.name || '',
    })
  }, [urlSearchForm.productCode, urlSearchForm.name])

  // 최종 searchForm (URL 상태 + 로컬 Input 상태)
  const searchForm = useMemo(
    () => ({
      ...urlSearchForm,
      ...localInputs,
    }),
    [urlSearchForm, localInputs],
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
      searchForm: urlSearchForm, // URL 상태만 사용 (로컬 Input 상태 제외)
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

  // Input 필드 업데이트 (로컬 상태만 변경, URL 반영 안함)
  const updateSearchForm = useCallback(
    (updates: Partial<ProductSearchForm>) => {
      // Input 필드만 로컬 상태로 관리
      const inputFields = { productCode: updates.productCode, name: updates.name }
      const hasInputUpdates = inputFields.productCode !== undefined || inputFields.name !== undefined

      if (hasInputUpdates) {
        setLocalInputs((prev) => ({
          ...prev,
          ...(inputFields.productCode !== undefined && { productCode: inputFields.productCode }),
          ...(inputFields.name !== undefined && { name: inputFields.name }),
        }))
      }

      // Input 필드가 아닌 다른 필드는 즉시 URL에 반영
      const nonInputUpdates = { ...updates }
      delete nonInputUpdates.productCode
      delete nonInputUpdates.name

      if (Object.keys(nonInputUpdates).length > 0) {
        const newSearchForm = { ...urlSearchForm, ...nonInputUpdates }
        const params = buildSearchParams(newSearchForm, INITIAL_PRODUCT_SEARCH_FORM, 0, pageSize)
        const url = params.toString() ? `?${params.toString()}` : ''
        router.push(url, { scroll: false })
      }
    },
    [urlSearchForm, pageSize, router],
  )

  // Combobox, Select 필드 업데이트 (URL 즉시 반영)
  const updateSearchFormImmediate = useCallback(
    (updates: Partial<ProductSearchForm>) => {
      const newSearchForm = { ...urlSearchForm, ...updates }
      const params = buildSearchParams(newSearchForm, INITIAL_PRODUCT_SEARCH_FORM, 0, pageSize)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [urlSearchForm, pageSize, router],
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
    updateSearchFormImmediate,

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
