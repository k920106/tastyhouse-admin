'use client'

import { useCallback } from 'react'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { useNoticeSearchContext } from '@/src/contexts/NoticeSearchContext'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { NoticeListItem, getNoticeActiveStatusLabel } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'

const NOTICE_COLUMNS: ColumnDef<NoticeListItem>[] = [
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
    cell: ({ row }) => <div>{formatToYYYYMMDD(row.original.createdAt)}</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'active',
    header: '활성 여부',
    cell: ({ row }) => <div>{getNoticeActiveStatusLabel(row.original.active)}</div>,
    meta: {
      className: 'border-x',
    },
  },
]

export default function NoticeList() {
  const { currentPage, pageSize, updateUrl, data, isLoading } = useNoticeSearchContext()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      updateUrl(null, newPage, newPageSize)
    },
    [updateUrl],
  )

  return (
    <CommonDataTable
      columns={NOTICE_COLUMNS}
      data={data?.notices || []}
      totalCount={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      handlePageChange={handlePageChange}
    />
  )
}
