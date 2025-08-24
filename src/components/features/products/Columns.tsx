'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/src/components/ui/Checkbox'
import { ProductListItem } from '@/src/types/product'

export const columns: ColumnDef<ProductListItem>[] = [
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
  },
  {
    accessorKey: 'id',
    header: 'No.',
  },
  {
    accessorKey: 'companyName',
    header: '매체사',
  },
  {
    accessorKey: 'productCode',
    header: '상품코드',
  },
  {
    accessorKey: 'name',
    header: '상품명',
  },
  {
    accessorKey: 'brandName',
    header: '교환처',
  },
  {
    accessorKey: 'validityPeriod',
    header: '유효일수',
  },
  {
    accessorKey: 'exhibitionPrice',
    header: '전시가',
  },
  {
    accessorKey: 'regularPrice',
    header: '정상가',
  },
  {
    accessorKey: 'supplier',
    header: '공급가',
  },
  {
    accessorKey: 'display',
    header: '전시상태',
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
  },
]
