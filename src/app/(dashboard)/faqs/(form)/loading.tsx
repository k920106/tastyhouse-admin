import PageTemplate from '@/src/components/layout/PageTemplate'
import { Skeleton } from '@/src/components/ui/Skeleton'
import { FAQ_CREATE_BREADCRUMBS } from '@/src/constants/faq'

export default function FaqFormLoading() {
  return (
    <PageTemplate breadcrumbs={FAQ_CREATE_BREADCRUMBS}>
      <Skeleton className="h-96 w-full" />
    </PageTemplate>
  )
}
