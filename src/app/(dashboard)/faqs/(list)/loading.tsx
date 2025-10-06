import PageTemplate from '@/src/components/layout/PageTemplate'
import { Skeleton } from '@/src/components/ui/Skeleton'
import { FAQ_LIST_BREADCRUMBS } from '@/src/constants/faq'

export default function FaqsLoading() {
  return (
    <PageTemplate breadcrumbs={FAQ_LIST_BREADCRUMBS}>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </PageTemplate>
  )
}
