'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useCallback } from 'react'

import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { type ApiPage } from '@/src/lib/pagination-utils'
import { ColumnDef } from '@tanstack/react-table'

interface ListPageLayoutProps<TData, TSearchForm = Record<string, never>> {
  // 데이터 테이블 관련
  columns: ColumnDef<TData>[]
  data: TData[]
  totalElements: number
  currentPage: number
  pageSize: number
  loading: boolean

  // 페이지네이션 핸들러
  updateUrl: (
    searchForm?: Partial<TSearchForm> | null,
    newPage?: ApiPage,
    newPageSize?: number,
  ) => void

  // 행 클릭 시 이동할 라우트
  detailRoute: (id: number | string) => string

  // 선택적 설정
  companyName?: string
  children?: ReactNode
}

export function ListPageLayout<
  TData extends { id: number | string },
  TSearchForm = Record<string, never>,
>({
  columns,
  data,
  totalElements,
  currentPage,
  pageSize,
  loading,
  updateUrl,
  detailRoute,
  companyName,
  children,
}: ListPageLayoutProps<TData, TSearchForm>) {
  const router = useRouter()

  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      updateUrl(null, newPage as ApiPage, newPageSize)
    },
    [updateUrl],
  )

  const handleRowClick = useCallback(
    (id: number | string) => {
      router.push(detailRoute(id))
    },
    [router, detailRoute],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <p className="text-sm">
            총 <span className="font-bold">{totalElements}</span> 건
          </p>
          {companyName && <p className="text-sm font-bold">{companyName}</p>}
        </div>
        <div className="flex gap-3">{children}</div>
      </div>
      <CommonDataTable
        columns={columns}
        data={data}
        totalCount={totalElements}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={loading}
        handlePageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
