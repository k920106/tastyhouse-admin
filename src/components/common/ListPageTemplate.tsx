import PageHeader from '@/src/components/layout/PageHeader'
import PageContent from '@/src/components/layout/PageContent'

interface ListPageTemplateProps {
  breadcrumbs: Array<{ label: string; href?: string }>
  children: React.ReactNode
}

export default function ListPageTemplate({ breadcrumbs, children }: ListPageTemplateProps) {
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageContent>{children}</PageContent>
    </>
  )
}
