import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { NoticeCreateRequest, NoticeCreateResponse, NoticeFormInput } from '@/src/types/notice'

export const transformNoticeFormToRequest = (
  data: NoticeFormInput,
): Omit<NoticeCreateRequest, 'id'> => ({
  companyId: Number(data.companyId),
  title: data.title,
  content: data.content,
  active: data.active,
  top: data.top,
})

/**
 * 공지사항 등록 API
 */
export async function handleNoticeCreate(data: NoticeFormInput) {
  try {
    const request = transformNoticeFormToRequest(data)

    const response = await api.post<ApiResponse<NoticeCreateResponse>>('/notices', request)
    if (!response.success || !response.data) {
      throw new Error(response.message || '등록에 실패했습니다.')
    }
    return response.data
  } catch (error) {
    throw error instanceof Error ? error : new Error('등록에 실패하였습니다.')
  }
}

/**
 * 공지사항 수정 API
 */
export async function handleNoticeUpdate(noticeId: number, data: NoticeFormInput) {
  try {
    const request = transformNoticeFormToRequest(data)

    const response = await api.put<ApiResponse<null>>(`/notices/${noticeId}`, request)
    if (!response.success) {
      throw new Error(response.message || '수정에 실패했습니다.')
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('수정에 실패하였습니다.')
  }
}
