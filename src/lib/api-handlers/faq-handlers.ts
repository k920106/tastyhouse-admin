import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { FaqCreateRequest, FaqCreateResponse, FaqFormInput } from '@/src/types/faq'

export const transformFaqFormToRequest = (data: FaqFormInput): Omit<FaqCreateRequest, 'id'> => ({
  companyId: Number(data.companyId),
  title: data.title,
  content: data.content,
  active: data.active,
  sort: data.sort,
})

/**
 * FAQ 등록 API
 */
export async function handleFaqCreate(data: FaqFormInput) {
  try {
    const request = transformFaqFormToRequest(data)

    const response = await api.post<ApiResponse<FaqCreateResponse>>('/faqs', request)
    if (!response.success || !response.data) {
      throw new Error(response.message || '등록에 실패했습니다.')
    }
    return response.data
  } catch (error) {
    throw error instanceof Error ? error : new Error('등록에 실패하였습니다.')
  }
}

/**
 * FAQ 수정 API
 */
export async function handleFaqUpdate(faqId: number, data: FaqFormInput) {
  try {
    const request = transformFaqFormToRequest(data)

    const response = await api.put<ApiResponse<null>>(`/faqs/${faqId}`, request)
    if (!response.success) {
      throw new Error(response.message || '수정에 실패했습니다.')
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('수정에 실패하였습니다.')
  }
}
