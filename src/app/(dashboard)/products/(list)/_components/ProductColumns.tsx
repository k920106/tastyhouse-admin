import { getProductDisplayStatusLabel, Product } from '@/src/types/product'
import { ColumnDef } from '@tanstack/react-table'

export const PRODUCT_COLUMNS: ColumnDef<Product>[] = [
  {
    id: 'rowNumber',
    header: 'No.',
    cell: ({ row, table }) => {
      const state = table.getState().pagination
      return <div>{state.pageIndex * state.pageSize + row.index + 1}</div>
    },
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
    accessorKey: 'supplyName',
    header: '공급사',
  },
  {
    accessorKey: 'exhibitionPrice',
    header: '전시가',
    cell: ({ row }) => <div>{row.original.exhibitionPrice.toLocaleString()}원</div>,
  },
  {
    accessorKey: 'regularPrice',
    header: '판매가',
    cell: ({ row }) => <div>{row.original.regularPrice.toLocaleString()}원</div>,
  },
  {
    accessorKey: '',
    header: '상품판매타입',
    cell: () => <div>-</div>,
  },
  {
    accessorKey: '',
    header: '유효일수',
    cell: () => <div>-</div>,
  },
  {
    accessorKey: '',
    header: '상품상태',
    cell: () => <div>-</div>,
  },
  {
    accessorKey: 'display',
    header: '전시상태',
    cell: ({ row }) => <div>{getProductDisplayStatusLabel(row.original.display)}</div>,
  },
  {
    accessorKey: '',
    header: 'RM 적용',
    cell: () => <div>-</div>,
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
  },
]
