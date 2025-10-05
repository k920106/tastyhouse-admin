import NoticeFilters from '@/src/app/(dashboard)/notices/(list)/_components/NoticeFilters'
import NoticeList from '@/src/app/(dashboard)/notices/(list)/_components/NoticeList'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { NOTICE_LIST_BREADCRUMBS } from '@/src/constants/notice'

// URL이 있는 경우에만 조회 - 최초 진입 시 기본값으로 자동 조회 X
export default function NoticeListPage() {
  return (
    <PageTemplate breadcrumbs={NOTICE_LIST_BREADCRUMBS}>
      <NoticeFilters />
      <NoticeList />
    </PageTemplate>
  )
}
