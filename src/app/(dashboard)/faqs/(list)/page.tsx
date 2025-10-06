import PageTemplate from '@/src/components/layout/PageTemplate'
import { FAQ_LIST_BREADCRUMBS } from '@/src/constants/faq'
import FaqFilters from './_components/FaqFilters'
import FaqList from './_components/FaqList'

export default function FaqListPage() {
  return (
    <PageTemplate breadcrumbs={FAQ_LIST_BREADCRUMBS}>
      <FaqFilters />
      <FaqList />
    </PageTemplate>
  )
}
