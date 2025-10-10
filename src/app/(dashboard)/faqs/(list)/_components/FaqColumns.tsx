import { getRowNumber } from '@/src/lib/table-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { Faq } from '@/src/types/faq'
import { ColumnDef } from '@tanstack/react-table'

export const FAQ_COLUMNS: ColumnDef<Faq>[] = [
  {
    id: 'rowNumber',
    header: 'No.',
    cell: ({ row, table }) => {
      const state = table.getState().pagination
      return getRowNumber(state.pageIndex, state.pageSize, row.index)
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
  },
  {
    accessorKey: 'active',
    header: '활성상태',
    cell: ({ row }) => getActiveStatusLabel(row.original.active),
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
  },
]
