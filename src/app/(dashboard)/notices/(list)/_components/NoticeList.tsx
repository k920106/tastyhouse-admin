'use client'

import { createColumns } from '@/src/components/features/notices/NoticeColumns'
import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { useNoticeSearchWithQuery } from '@/src/hooks/useNoticeSearchWithQuery'
import { useCallback } from 'react'

export default function NoticeList() {
  const { currentPage, pageSize, urlSearchForm, updateUrl, data, isLoading } =
    useNoticeSearchWithQuery()

  // 페이지네이션 핸들러
  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const targetPageSize = newPageSize ?? pageSize
      updateUrl(urlSearchForm, newPage, targetPageSize)
    },
    [urlSearchForm, pageSize, updateUrl],
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
