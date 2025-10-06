'use client'

import { ListPageLayout } from '@/src/components/shared/ListPageLayout'
import { buttonVariants } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/constants/routes'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { formatToYYYYMMDD } from '@/src/lib/date-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { Notice } from '@/src/types/notice'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

const NOTICE_COLUMNS: ColumnDef<Notice>[] = [
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
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useNoticeSearchWithQuery()

  return (
    <ListPageLayout
      columns={NOTICE_COLUMNS}
      data={data?.notices || []}
      totalElements={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      updateUrl={updateUrl}
      detailRoute={ROUTES.NOTICES.DETAIL}
      companyName={urlSearchForm.companyName}
    >
      <Link href={ROUTES.NOTICES.CREATE} className={buttonVariants({ variant: 'outline' })}>
        등록
      </Link>
    </ListPageLayout>
  )
}
