import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { getRowNumber } from '@/src/lib/table-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { Notice } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'

export const NOTICE_COLUMNS: ColumnDef<Notice>[] = [
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
    accessorKey: 'createdAt',
    header: '등록일자',
    cell: ({ row }) => formatToYYYYMMDD(row.original.createdAt),
  },
  {
    accessorKey: 'active',
    header: '활성상태',
    cell: ({ row }) => getActiveStatusLabel(row.original.active),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
]
