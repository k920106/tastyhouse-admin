import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { Notice } from '@/src/types/notice'
import NoticeUpdate from './_components/NoticeUpdate'

export default async function NoticeUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const response = await api.get<ApiResponse>(`/notices/${id}`)
  const notice: Partial<Notice> = response.data ?? {}

  return <NoticeUpdate notice={notice as Notice} />
}
