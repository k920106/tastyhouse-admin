import { Suspense } from 'react'
import NoticeList from './_components/NoticeList'

export default function NoticeListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoticeList />
    </Suspense>
  )
}
