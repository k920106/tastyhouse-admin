'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { buttonVariants } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/constants/routes'
import { useFaqSearchWithQuery } from '@/src/hooks/faq/useFaqSearchWithQuery'
import { cn } from '@/src/lib/class-utils'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { getActiveStatusLabel } from '@/src/types/common'
import { Faq } from '@/src/types/faq'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

const FAQ_COLUMNS: ColumnDef<Faq>[] = [
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
      className: 'border-x text-center',
    },
  },
]

export default function FaqList() {
  const router = useRouter()
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useFaqSearchWithQuery()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      updateUrl(null, newPage as ApiPage, newPageSize)
    },
    [updateUrl],
  )

  const handleRowClick = useCallback(
    (faqId: number | string) => {
      router.push(ROUTES.FAQS.DETAIL(faqId))
    },
    [router],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <p className="text-sm">
            총 <span className="font-bold">{data?.totalElements || 0}</span> 건
          </p>
          {urlSearchForm.companyName && (
            <p className="text-sm font-bold">{urlSearchForm.companyName}</p>
          )}
        </div>
        <Link
          href={ROUTES.FAQS.CREATE}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            isLoading && 'pointer-events-none opacity-50',
          )}
        >
          등록
        </Link>
      </div>
      <CommonDataTable
        columns={FAQ_COLUMNS}
        data={data?.faqs || []}
        totalCount={data?.totalElements || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={isLoading}
        handlePageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
