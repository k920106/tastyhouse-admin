'use client'

import { ListPageLayout } from '@/src/components/shared/ListPageLayout'
import { buttonVariants } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/constants/routes'
import { useFaqSearchWithQuery } from '@/src/hooks/faq/useFaqSearchWithQuery'
import { getActiveStatusLabel } from '@/src/types/common'
import { Faq } from '@/src/types/faq'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

const FAQ_COLUMNS: ColumnDef<Faq>[] = [
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
    accessorKey: 'active',
    header: '활성상태',
    cell: ({ row }) => <div>{getActiveStatusLabel(row.original.active)}</div>,
    meta: {
      className: 'border-x',
    },
  },
  {
    accessorKey: 'sort',
    header: '우선순위',
    cell: ({ row }) => <div>{row.original.sort}</div>,
    meta: {
      className: 'border-x',
    },
  },
]

export default function FaqList() {
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useFaqSearchWithQuery()

  return (
    <ListPageLayout
      columns={FAQ_COLUMNS}
      data={data?.faqs || []}
      totalElements={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      updateUrl={updateUrl}
      detailRoute={ROUTES.FAQS.DETAIL}
      companyName={urlSearchForm.companyName}
    >
      <Link href={ROUTES.FAQS.CREATE} className={buttonVariants({ variant: 'outline' })}>
        등록
      </Link>
    </ListPageLayout>
  )
}
