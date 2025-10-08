import { getActiveStatusLabel } from '@/src/types/common'
import { Faq } from '@/src/types/faq'
import { ColumnDef } from '@tanstack/react-table'

export const FAQ_COLUMNS: ColumnDef<Faq>[] = [
  {
    id: 'rowNumber',
    header: 'No.',
    meta: {
      className: 'border-x',
    },
    cell: ({ row, table }) => {
      const state = table.getState().pagination
      return <div>{state.pageIndex * state.pageSize + row.index + 1}</div>
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'active',
    header: '활성상태',
    cell: ({ row }) => <div>{getActiveStatusLabel(row.original.active)}</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
    cell: ({ row }) => <div>{row.original.sort}</div>,
    meta: {
      className: 'border-x',
    },
  },
]
