'use client'

import NoticeSearchForm from '@/src/components/features/notices/NoticeSearchForm'
import NoticeDataTable from '@/src/components/features/notices/NoticeDataTable'
import { useNoticeSearchWithQuery } from '@/src/hooks/useNoticeSearchWithQuery'

export default function NoticeManagement() {
  const noticeSearchHook = useNoticeSearchWithQuery()

  return (
    <>
      <NoticeSearchForm
        searchForm={noticeSearchHook.searchForm}
        loading={noticeSearchHook.loading}
        updateSearchForm={noticeSearchHook.updateSearchForm}
        handleSearch={noticeSearchHook.handleSearch}
      />
      <NoticeDataTable
        notices={noticeSearchHook.notices}
        totalCount={noticeSearchHook.totalCount}
        currentPage={noticeSearchHook.currentPage}
        pageSize={noticeSearchHook.pageSize}
        loading={noticeSearchHook.loading}
        handlePageChange={noticeSearchHook.handlePageChange}
      />
    </>
  )
}
