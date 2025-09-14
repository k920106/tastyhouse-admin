'use client'

import PageTemplate from '@/src/components/layout/PageTemplate'
import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { createColumns } from '@/src/components/features/products/ProductColumns'
import { useProductSearchForm } from '@/src/hooks/useProductSearchForm'
import { useProductPagination } from '@/src/hooks/useProductPagination'
import { useProductsQuery } from '@/src/hooks/queries/useProductQueries'
import { useToastError } from '@/src/hooks/useToastError'
import { PRODUCT_BREADCRUMBS } from '@/src/constants/product'

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
