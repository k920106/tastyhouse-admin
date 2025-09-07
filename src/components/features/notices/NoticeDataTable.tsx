'use client'

import { NoticeListItem } from '@/src/types/notice'
import { createColumns } from '@/src/components/features/notices/NoticeColumns'
import { CommonDataTable } from '../../ui/CommonDataTable'

interface NoticeDataTableProps {
  notices: NoticeListItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  loading: boolean
  handlePageChange: (page: number, size: number) => void
}

export default function NoticeDataTable({
  notices,
  totalCount,
  currentPage,
  pageSize,
  loading,
  handlePageChange,
}: NoticeDataTableProps) {
  return (
    <CommonDataTable
      columns={createColumns(currentPage, pageSize)}
      data={notices}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={loading}
      handlePageChange={handlePageChange}
    />
  )
}
