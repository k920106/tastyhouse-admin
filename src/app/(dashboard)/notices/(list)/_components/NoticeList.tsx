'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { ROUTES } from '@/src/constants/routes'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { NoticeListItem } from '@/src/types/notice'
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
    header: '활성상태',
    cell: ({ row }) => <div>{getActiveStatusLabel(row.original.active)}</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div>{row.original.id}</div>,
    meta: {
      className: 'border-x',
    },
  },
]

export default function NoticeList() {
  const router = useRouter()
  const { currentPage, pageSize, updateUrl, data, isLoading } = useNoticeSearchWithQuery()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      updateUrl(null, newPage as ApiPage, newPageSize)
    },
    [updateUrl],
  )

  const handleRowClick = useCallback(
    (noticeId: number | string) => {
      router.push(ROUTES.NOTICES.DETAIL(noticeId))
    },
    [router],
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
      onRowClick={handleRowClick}
    />
  )
}
