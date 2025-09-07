'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductSearchForm } from '@/src/types/product'
import { toast } from 'sonner'
import { parseSearchParamsToForm, buildSearchParams } from '@/src/lib/url-utils'
import { INITIAL_PRODUCT_SEARCH_FORM } from '@/src/constants/product'
import { validateProductSearchForm } from '@/src/lib/validations/product'

export interface ProductSearchFormHookResult {
  // 검색 폼 상태 (로컬)
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void

  // URL 기반 검색 폼 (실제 쿼리용)
  urlSearchForm: ProductSearchForm
  shouldExecuteQuery: boolean

  // 검색 액션
  handleSearch: () => void
}

export const useProductSearchForm = (): ProductSearchFormHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 로컬 검색 폼 상태 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [searchForm, setSearchForm] = useState<ProductSearchForm>(initialSearchForm)

  // URL에서 현재 검색 조건 파싱 (실제 쿼리 실행용)
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_PRODUCT_SEARCH_FORM),
    [searchParams],
  )

  // 검색 버튼 클릭 시에만 쿼리 실행
  const shouldExecuteQuery = useMemo(() => {
    return searchParams.size > 0
  }, [searchParams])

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (form: ProductSearchForm, page: number = 0) => {
      const params = buildSearchParams(form, INITIAL_PRODUCT_SEARCH_FORM, page)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router],
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

  return {
    searchForm,
    urlSearchForm,
    shouldExecuteQuery,
    updateSearchForm,
    handleSearch,
  }
}
