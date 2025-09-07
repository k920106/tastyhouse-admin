'use client'

import { useEffect } from 'react'
import NoticeSearchForm from '@/src/components/features/notices/NoticeSearchForm'
import NoticeDataTable from '@/src/components/features/notices/NoticeDataTable'
import { useNoticeSearchForm } from '@/src/hooks/useNoticeSearchForm'
import { useNoticePagination } from '@/src/hooks/useNoticePagination'
import { useNoticesQuery } from '@/src/hooks/queries/useNoticeQueries'
import { toast } from 'sonner'

export default function NoticeManagement() {
  const searchFormHook = useNoticeSearchForm()
  const paginationHook = useNoticePagination()

  const { data, isLoading, error } = useNoticesQuery(
    {
      searchForm: searchFormHook.urlSearchForm,
      pagination: {
        page: paginationHook.currentPage,
        size: paginationHook.pageSize,
      },
    },
    searchFormHook.shouldExecuteQuery,
  )

  useEffect(() => {
    if (error) {
      console.error('공지사항 목록 조회 실패:', error)
      toast.error('공지사항 목록 조회 중 오류가 발생했습니다.')
    }
  }, [error])

  return (
    <>
      <NoticeSearchForm
        searchForm={searchFormHook.searchForm}
        updateSearchForm={searchFormHook.updateSearchForm}
        handleSearch={searchFormHook.handleSearch}
        loading={isLoading}
      />
      <NoticeDataTable
        notices={data?.notices || []}
        totalCount={data?.totalCount || 0}
        currentPage={paginationHook.currentPage}
        pageSize={paginationHook.pageSize}
        handlePageChange={paginationHook.handlePageChange}
        loading={isLoading}
      />
    </>
  )
}
