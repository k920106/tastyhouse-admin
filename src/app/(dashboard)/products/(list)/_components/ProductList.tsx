'use client'

import ProductSearchForm from '@/src/app/(dashboard)/products/(list)/_components/ProductSearchForm'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { PRODUCT_BREADCRUMBS } from '@/src/constants/product'
import { useProductsQuery } from '@/src/hooks/queries/useProductQueries'
import { useProductPagination } from '@/src/hooks/useProductPagination'
import { useProductSearchForm } from '@/src/hooks/useProductSearchForm'
import { useToastError } from '@/src/hooks/useToastError'
import { createColumns } from './ProductColumns'

export default function ProductList() {
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

  useToastError(error, '상품 목록 조회 중 오류가 발생했습니다.')

  return (
    <PageTemplate breadcrumbs={PRODUCT_BREADCRUMBS}>
      <ProductSearchForm
        searchForm={searchFormHook.searchForm}
        updateSearchForm={searchFormHook.updateSearchForm}
        handleSearch={searchFormHook.handleSearch}
        loading={isLoading}
      />
      <CommonDataTable
        columns={createColumns(paginationHook.currentPage, paginationHook.pageSize)}
        data={data?.products || []}
        totalCount={data?.totalElements || 0}
        currentPage={paginationHook.currentPage}
        pageSize={paginationHook.pageSize}
        loading={isLoading}
        handlePageChange={paginationHook.handlePageChange}
      />
    </PageTemplate>
  )
}
