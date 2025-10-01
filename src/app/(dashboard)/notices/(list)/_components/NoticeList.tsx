'use client'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { NoticeListItem, getNoticeActiveStatusLabel } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'

export default function NoticeList() {
  const { currentPage, pageSize, urlSearchForm, updateUrl, data, isLoading } =
    useNoticeSearchWithQuery()

  // 컬럼 정의 - rowNumber만 동적이므로 한곳에서 관리
  const columns: ColumnDef<NoticeListItem>[] = useMemo(
    () => [
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
    [currentPage, pageSize],
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
