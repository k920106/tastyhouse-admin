import { api } from '@/src/lib/api'
import { transformNoticeFormToRequest } from '@/src/lib/transformers/notice-transformer'
import { ApiResponse } from '@/src/types/api'
import { NoticeCreateResponse, NoticeFormInput } from '@/src/types/notice'

/**
 * 공지사항 등록 API 호출
 * @param data - 공지사항 폼 데이터
 * @returns 생성된 공지사항 ID
 * @throws Error - API 호출 실패 시
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
 * 공지사항 수정 API 호출
 * @param noticeId - 공지사항 ID
 * @param data - 공지사항 폼 데이터
 * @throws Error - API 호출 실패 시
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
