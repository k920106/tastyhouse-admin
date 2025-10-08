'use client'

import { ListPageLayout } from '@/src/components/shared/ListPageLayout'
import { buttonVariants } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/constants/routes'
import { useFaqSearchWithQuery } from '@/src/hooks/faq/useFaqSearchWithQuery'
import { getTableData } from '@/src/lib/table-utils'
import Link from 'next/link'
import { FAQ_COLUMNS } from './FaqColumns'

export default function FaqList() {
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useFaqSearchWithQuery()

  return (
    <ListPageLayout
      columns={FAQ_COLUMNS}
      data={getTableData(isLoading, data?.faqs)}
      totalElements={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      updateUrl={updateUrl}
      detailRoute={ROUTES.FAQS.DETAIL}
      companyName={urlSearchForm.companyName}
    >
      <Link href={ROUTES.FAQS.CREATE} className={buttonVariants({ variant: 'outline' })}>
        등록
      </Link>
    </ListPageLayout>
  )
}
