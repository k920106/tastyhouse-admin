import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { Notice } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'

export const NOTICE_COLUMNS: ColumnDef<Notice>[] = [
  {
    id: 'rowNumber',
    header: 'No.',
    cell: ({ row, table }) => {
      const state = table.getState().pagination
      return <div>{state.pageIndex * state.pageSize + row.index + 1}</div>
    },
  },
  {
    accessorKey: 'title',
    header: '제목',
  },
  {
    accessorKey: 'createdAt',
    header: '등록일자',
    cell: ({ row }) => <div>{formatToYYYYMMDD(row.original.createdAt)}</div>,
  },
  {
    accessorKey: 'active',
    header: '활성상태',
    cell: ({ row }) => <div>{getActiveStatusLabel(row.original.active)}</div>,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
]
