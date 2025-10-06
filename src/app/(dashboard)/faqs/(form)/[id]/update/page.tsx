import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { Faq } from '@/src/types/faq'
import { notFound } from 'next/navigation'
import FaqUpdate from './_components/FaqUpdate'

interface FaqUpdatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FaqUpdatePage({ params }: FaqUpdatePageProps) {
  const { id } = await params

  try {
    const response = await api.get<ApiResponse<Faq>>(`/faqs/${id}`)

    if (!response.success || !response.data) {
      notFound()
    }

    return <FaqUpdate faq={response.data} />
  } catch {
    notFound()
  }
}
