'use client'

import { useEffect } from 'react'
import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import ProductDataTable from '@/src/components/features/products/ProductDataTable'
import { useProductSearchForm } from '@/src/hooks/useProductSearchForm'
import { useProductPagination } from '@/src/hooks/useProductPagination'
import { useProductsQuery } from '@/src/hooks/queries/useProductQueries'
import { toast } from 'sonner'

export default function ProductManagement() {
  const searchFormHook = useProductSearchForm()
  const paginationHook = useProductPagination()

  const { data, isLoading, error } = useProductsQuery(
    {
      searchForm: searchFormHook.urlSearchForm,
      pagination: {
        page: paginationHook.currentPage,
        size: paginationHook.pageSize,
      },
    },
    searchFormHook.shouldExecuteQuery,
  )

  useEffect(() => {
    if (error) {
      console.error('상품 목록 조회 실패:', error)
      toast.error('상품 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  return (
    <>
      <ProductSearchForm
        searchForm={searchFormHook.searchForm}
        updateSearchForm={searchFormHook.updateSearchForm}
        handleSearch={searchFormHook.handleSearch}
        loading={isLoading}
      />
      <ProductDataTable
        products={data?.products || []}
        totalCount={data?.totalCount || 0}
        currentPage={paginationHook.currentPage}
        pageSize={paginationHook.pageSize}
        handlePageChange={paginationHook.handlePageChange}
        loading={isLoading}
      />
    </>
  )
}

/*
  const { currentPage, pageSize, handlePageChange } = useProductPagination()
  ㄴ 권장하지 않는 방식?

  네, 맞습니다. 구조 분해 할당 방식보다는 객체로 받는 방식을 권장합니다.

  현재 방식의 문제점

  1. 네이밍 충돌 위험

  // 만약 다른 훅에서도 같은 이름이 있다면?
  const { currentPage } = useProductPagination()
  const { currentPage } = useOrderPagination() // ❌ 충돌!

  2. 코드 가독성 저하

  - 어떤 함수가 어느 훅에서 온 건지 추적하기 어려움
  - IDE에서 자동완성이나 타입 추론이 불완전할 수 있음

  3. 리팩토링 어려움

  - 훅 내부 속성명 변경 시 모든 사용처를 찾아 수정해야 함
*/
