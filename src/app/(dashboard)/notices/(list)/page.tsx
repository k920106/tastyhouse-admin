import { Suspense } from 'react'

import NoticeFilters from '@/src/app/(dashboard)/notices/(list)/_components/NoticeFilters'
import NoticeList from '@/src/app/(dashboard)/notices/(list)/_components/NoticeList'
import PageListSkeleton from '@/src/components/layout/PageListSkeleton'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { NOTICE_LIST_BREADCRUMBS } from '@/src/constants/notice'
import { NoticeSearchProvider } from '@/src/contexts/NoticeSearchContext'

export default function NoticeListPage() {
  return (
    <Suspense fallback={<PageListSkeleton />}>
      <PageTemplate breadcrumbs={NOTICE_LIST_BREADCRUMBS}>
        <NoticeSearchProvider>
          <NoticeFilters />
          <NoticeList />
        </NoticeSearchProvider>
      </PageTemplate>
    </Suspense>
  )
}
