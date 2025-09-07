import PageHeader from '@/src/components/layout/PageHeader'
import PageContent from '@/src/components/layout/PageContent'
import NoticeManagement from '@/src/components/features/notices/NoticeManagement'

export default function NoticeList() {
  const breadcrumbs = [
    { label: '고객센터' },
    { label: '게시판' },
    { label: '공지사항', href: '/notices' },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageContent>
        <NoticeManagement />
      </PageContent>
    </>
  )
}
