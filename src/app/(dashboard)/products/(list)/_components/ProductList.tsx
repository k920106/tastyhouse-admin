'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { ROUTES } from '@/src/constants/routes'
import { useProductSearchWithQuery } from '@/src/hooks/product/useProductSearchWithQuery'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { getProductDisplayStatusLabel, Product } from '@/src/types/product'
import { ColumnDef } from '@tanstack/react-table'

const PRODUCT_COLUMNS: ColumnDef<Product>[] = [
  {
    id: 'rowNumber',
    header: 'No.',
    meta: {
      className: 'border-x text-center',
    },
    cell: ({ row, table }) => {
      const state = table.getState().pagination
      return <div>{state.pageIndex * state.pageSize + row.index + 1}</div>
    },
  },
  {
    accessorKey: 'productCode',
    header: '상품코드',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'name',
    header: '상품명',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'brandName',
    header: '교환처',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'supplyName',
    header: '공급사',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'exhibitionPrice',
    header: '전시가',
    cell: ({ row }) => <div>{row.original.exhibitionPrice.toLocaleString()}원</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'regularPrice',
    header: '판매가',
    cell: ({ row }) => <div>{row.original.regularPrice.toLocaleString()}원</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: '',
    header: '상품판매타입',
    cell: () => <div>-</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: '',
    header: '유효일수',
    cell: () => <div>-</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: '',
    header: '상품상태',
    cell: () => <div>-</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'display',
    header: '전시상태',
    cell: ({ row }) => <div>{getProductDisplayStatusLabel(row.original.display)}</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: '',
    header: 'RM 적용',
    cell: () => <div>-</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
    meta: {
      className: 'border-x',
    },
  },
]

export default function ProductList() {
  const router = useRouter()
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useProductSearchWithQuery()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      updateUrl(null, newPage as ApiPage, newPageSize)
    },
    [updateUrl],
  )

  const handleRowClick = useCallback(
    (productId: number | string) => {
      router.push(ROUTES.PRODUCTS.DETAIL(productId))
    },
    [router],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <p className="text-sm">
            총 <span className="font-bold">{data?.totalElements || 0}</span> 건
          </p>
          {urlSearchForm.companyName && (
            <p className="text-sm font-bold">{urlSearchForm.companyName}</p>
          )}
        </div>
      </div>
      <CommonDataTable
        columns={PRODUCT_COLUMNS}
        data={data?.products || []}
        totalCount={data?.totalElements || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={isLoading}
        handlePageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
