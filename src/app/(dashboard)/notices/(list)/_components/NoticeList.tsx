'use client'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { NoticeListItem, getNoticeUseStatusLabel } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback } from 'react'

const createColumns = (currentPage: number, pageSize: number): ColumnDef<NoticeListItem>[] => [
  {
    id: 'rowNumber',
    header: 'No.',
    meta: {
      className: 'border-x text-center',
    },
    cell: ({ row }) => <div>{currentPage * pageSize + row.index + 1}</div>,
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

export default function NoticeList() {
  const { currentPage, pageSize, urlSearchForm, updateUrl, data, isLoading } =
    useNoticeSearchWithQuery()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updateUrl(urlSearchForm, newPage, targetPageSize)
    },
    [pageSize, updateUrl, urlSearchForm],
  )

  return (
    <CommonDataTable
      columns={createColumns(currentPage, pageSize)}
      data={data?.notices || []}
      totalCount={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      handlePageChange={handlePageChange}
    />
  )
}
