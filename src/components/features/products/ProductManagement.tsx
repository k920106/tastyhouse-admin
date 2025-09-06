'use client'

import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import ProductDataTable from '@/src/components/features/products/ProductDataTable'
import { useProductSearchWithQuery } from '@/src/hooks/useProductSearchWithQuery'

export default function ProductManagement() {
  const productSearchHook = useProductSearchWithQuery()

  return (
    <>
      <ProductSearchForm
        searchForm={productSearchHook.searchForm}
        loading={productSearchHook.loading}
        updateSearchForm={productSearchHook.updateSearchForm}
        handleSearch={productSearchHook.handleSearch}
      />
      <ProductDataTable
        products={productSearchHook.products}
        totalCount={productSearchHook.totalCount}
        currentPage={productSearchHook.currentPage}
        pageSize={productSearchHook.pageSize}
        loading={productSearchHook.loading}
        handlePageChange={productSearchHook.handlePageChange}
      />
    </>
  )
}
