import { Suspense } from 'react'
import PageHeader from '@/src/components/layout/PageHeader'
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 min-h-[100vh] md:min-h-min">
          <Suspense fallback={<div>로딩 중...</div>}>
            <NoticeManagement />
          </Suspense>
        </div>
      </div>
    </>
  )
}
