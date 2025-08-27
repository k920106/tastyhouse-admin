'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/src/components/ui/Checkbox'
import { ProductListItem } from '@/src/types/product'
import { formatNumberWithCommas } from '@/src/lib/utils'

export const createColumns = (
  currentPage: number,
  pageSize: number,
): ColumnDef<ProductListItem>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    meta: {
      className: 'w-10 p-0',
    },
  },
  {
    id: 'rowNumber',
    header: 'No.',
    meta: {
      className: 'border-x text-center',
    },
    cell: ({ row }) => <div className="text-center">{currentPage * pageSize + row.index + 1}</div>,
  },
  {
    accessorKey: 'companyName',
    header: '매체사',
    meta: {
      className: 'border-x',
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
    header: '공급처',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'validityPeriod',
    header: '유효일수',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'exhibitionPrice',
    header: '전시가',
    cell: ({ getValue }) => formatNumberWithCommas(getValue<number>()),
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'regularPrice',
    header: '정상가',
    cell: ({ getValue }) => formatNumberWithCommas(getValue<number>()),
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'supplyPrice',
    header: '공급가',
    cell: ({ getValue }) => formatNumberWithCommas(getValue<number>()),
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'display',
    header: '전시상태',
    cell: ({ getValue }) => (getValue<boolean>() ? '전시' : '미전시'),
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
