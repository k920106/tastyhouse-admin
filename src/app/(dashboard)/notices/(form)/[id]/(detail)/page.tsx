import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { Notice } from '@/src/types/notice'
import NoticeDetail from './_components/NoticeDetail'

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const response = await api.get<ApiResponse>(`/notices/${id}`)
  const notice: Partial<Notice> = response.data ?? {}

  return <NoticeDetail notice={notice as Notice} />
}
