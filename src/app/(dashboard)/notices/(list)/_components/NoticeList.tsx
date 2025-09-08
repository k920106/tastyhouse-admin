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

/**
 * NoticeTable 컴포넌트 생성 시 문제점:

  1. 불필요한 추상화: CommonDataTable은 이미 범용적인 테이블 컴포넌트인데, NoticeTable 전용 래퍼를 만들면 오히려
  복잡도 증가
  2. hook 위치 모호: useNoticesQuery를 @Notice 안에 두면 상위에서 로딩 상태나 에러 처리를 제어하기 어려워짐
  3. ListPageTemplate 패턴 일관성: 프로젝트의 다른 리스트 페이지들과 구조적 일관성이 깨짐

  현재 구조의 장점:
  1. 명확한 관심사 분리:
    - useNoticeSearchForm - 검색 로직
    - useNoticePagination - 페이지네이션 로직
    - useNoticesQuery - 데이터 fetching 로직
    - NoticeList - 컴포넌트 조합 및 상태 연결
  2. 재사용성: 각 hook들이 독립적으로 다른 컴포넌트에서도 사용 가능
  3. 테스트 용이성: 로직별로 분리되어 있어 단위 테스트가 쉬움

  현재 구조는 Next.js App Router + 커스텀 hook 패턴의 모범 사례입니다. 각 hook의 역할이 명확하고 조합 가능한
  형태로 잘 설계되어 있어요.
*/
