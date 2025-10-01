import NoticeFilters from '@/src/app/(dashboard)/notices/(list)/_components/NoticeFilters'
import NoticeSearchContainer from '@/src/app/(dashboard)/notices/(list)/_components/NoticeSearchContainer'
import PageListSkeleton from '@/src/components/layout/PageListSkeleton'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { NOTICE_LIST_BREADCRUMBS } from '@/src/constants/notice'
import { Suspense } from 'react'
import NoticeList from './_components/NoticeList'

export default function NoticeListPage() {
  return (
    <Suspense fallback={<PageListSkeleton />}>
      <PageTemplate breadcrumbs={NOTICE_LIST_BREADCRUMBS}>
        <NoticeSearchContainer>
          <NoticeFilters />
          <NoticeList />
        </NoticeSearchContainer>
      </PageTemplate>
    </Suspense>
  )
}
