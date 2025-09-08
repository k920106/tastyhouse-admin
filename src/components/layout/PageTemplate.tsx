import PageHeader from '@/src/components/layout/PageHeader'
import PageContent from '@/src/components/layout/PageContent'

interface PageTemplateProps {
  breadcrumbs: Array<{ label: string; href?: string }>
  children: React.ReactNode
}

export default function PageTemplate({ breadcrumbs, children }: PageTemplateProps) {
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageContent>{children}</PageContent>
    </>
  )
}
