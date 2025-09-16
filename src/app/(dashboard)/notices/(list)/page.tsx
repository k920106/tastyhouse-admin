import { Suspense } from 'react'
import NoticeFilters from '@/src/app/(dashboard)/notices/(list)/_components/NoticeFilters'
import NoticeList from './_components/NoticeList'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { NOTICE_LIST_BREADCRUMBS } from '@/src/constants/notice'

export default function NoticeListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageTemplate breadcrumbs={NOTICE_LIST_BREADCRUMBS}>
        <NoticeFilters />
        <NoticeList />
      </PageTemplate>
    </Suspense>
  )
}
