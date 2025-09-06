'use client'

import { DataTable } from '@/src/components/features/products/DataTable'
import { createColumns } from '@/src/components/features/products/ProductColumns'
import { ProductListItem } from '@/src/types/product'

interface ProductDataTableProps {
  products: ProductListItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  loading: boolean
  handlePageChange: (page: number, size: number) => void
}

export default function ProductDataTable({
  products,
  totalCount,
  currentPage,
  pageSize,
  loading,
  handlePageChange,
}: ProductDataTableProps) {
  return (
    <DataTable
      columns={createColumns(currentPage, pageSize)}
      data={products}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={loading}
      handlePageChange={handlePageChange}
    />
  )
}
