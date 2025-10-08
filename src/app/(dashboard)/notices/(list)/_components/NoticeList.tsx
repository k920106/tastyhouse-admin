'use client'

import { ListPageLayout } from '@/src/components/shared/ListPageLayout'
import { buttonVariants } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/constants/routes'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import Link from 'next/link'
import { NOTICE_COLUMNS } from './NoticeColumns'

export default function NoticeList() {
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useNoticeSearchWithQuery()

  return (
    <ListPageLayout
      columns={NOTICE_COLUMNS}
      data={data?.notices || []}
      totalElements={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      updateUrl={updateUrl}
      detailRoute={ROUTES.NOTICES.DETAIL}
      companyName={urlSearchForm.companyName}
    >
      <Link href={ROUTES.NOTICES.CREATE} className={buttonVariants({ variant: 'outline' })}>
        등록
      </Link>
    </ListPageLayout>
  )
}
