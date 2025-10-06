import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { Faq } from '@/src/types/faq'
import { notFound } from 'next/navigation'
import FaqDetail from './_components/FaqDetail'

interface FaqDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FaqDetailPage({ params }: FaqDetailPageProps) {
  const { id } = await params

  try {
    const response = await api.get<ApiResponse<Faq>>(`/faqs/${id}`)

    if (!response.success || !response.data) {
      notFound()
    }

    return <FaqDetail faq={response.data} />
  } catch {
    notFound()
  }
}
