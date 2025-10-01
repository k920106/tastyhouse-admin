'use client'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { useNoticeSearchContext } from '@/src/contexts/NoticeSearchContext'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { NoticeListItem, getNoticeActiveStatusLabel } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'

export default function NoticeList() {
  const { currentPage, pageSize, urlSearchForm, updateUrl, data } = useNoticeSearchWithQuery()
  const { isLoading } = useNoticeSearchContext()

  const columns: ColumnDef<NoticeListItem>[] = useMemo(
    () => [
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
    ],
    [],
  )

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updateUrl(urlSearchForm, newPage, targetPageSize)
    },
    [pageSize, updateUrl, urlSearchForm],
  )

  return (
    <CommonDataTable
      columns={columns}
      data={data?.notices || []}
      totalCount={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      handlePageChange={handlePageChange}
    />
  )
}
