'use client'

import { ColumnDef } from '@tanstack/react-table'
import { NoticeListItem, getNoticeUseStatusLabel } from '@/src/types/notice'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'

export const createColumns = (
  currentPage: number,
  pageSize: number,
): ColumnDef<NoticeListItem>[] => [
  {
    id: 'rowNumber',
    header: 'No.',
    meta: {
      className: 'border-x text-center',
    },
    cell: ({ row }) => (
      <div aria-label={`${currentPage * pageSize + row.index + 1}번째 행`}>
        {currentPage * pageSize + row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: 'companyName',
    header: '매체사',
    meta: {
      className: 'border-x',
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
    accessorKey: 'createdAt',
    header: '등록일자',
    cell: ({ row }) => {
      return <div>{formatToYYYYMMDD(row.original.createdAt)}</div>
    },
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'isUse',
    header: '사용 여부',
    cell: ({ row }) => {
      return <div>{getNoticeUseStatusLabel(row.original.isUse)}</div>
    },
    meta: {
      className: 'border-x',
    },
  },
]
