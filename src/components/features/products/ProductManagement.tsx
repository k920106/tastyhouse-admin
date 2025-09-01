'use client'

import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import ProductDataTable from '@/src/components/features/products/ProductDataTable'
import { useProductSearch } from '@/src/hooks/useProductSearch'

export default function ProductManagement() {
  const productSearchHook = useProductSearch()

  return (
    <>
      <ProductSearchForm
        searchForm={productSearchHook.searchForm}
        updateSearchForm={productSearchHook.updateSearchForm}
        handleSearch={productSearchHook.handleSearch}
        loading={productSearchHook.loading}
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
