'use client'

import ListPageTemplate from '@/src/components/common/ListPageTemplate'
import NoticeSearchForm from '@/src/components/features/notices/NoticeSearchForm'
import { CommonDataTable } from '@/src/components/shared/CommonDataTable'
import { createColumns } from '@/src/components/features/notices/NoticeColumns'
import { useNoticeSearchForm } from '@/src/hooks/useNoticeSearchForm'
import { useNoticePagination } from '@/src/hooks/useNoticePagination'
import { useNoticesQuery } from '@/src/hooks/queries/useNoticeQueries'
import { useToastError } from '@/src/hooks/useToastError'
import { NOTICE_BREADCRUMBS } from '@/src/constants/notice'

export default function NoticeList() {
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

  useToastError(error, '공지사항 목록 조회 중 오류가 발생했습니다.')

  return (
    <ListPageTemplate breadcrumbs={NOTICE_BREADCRUMBS}>
      <NoticeSearchForm
        searchForm={searchFormHook.searchForm}
        updateSearchForm={searchFormHook.updateSearchForm}
        handleSearch={searchFormHook.handleSearch}
        loading={isLoading}
      />
      <CommonDataTable
        columns={createColumns(paginationHook.currentPage, paginationHook.pageSize)}
        data={data?.notices || []}
        totalCount={data?.totalCount || 0}
        currentPage={paginationHook.currentPage}
        pageSize={paginationHook.pageSize}
        loading={isLoading}
        handlePageChange={paginationHook.handlePageChange}
      />
    </ListPageTemplate>
  )
}
