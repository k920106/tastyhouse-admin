import { NoticeCreateRequest, NoticeFormInput } from '@/src/types/notice'

/**
 * 공지사항 폼 데이터를 API 요청 형식으로 변환
 * @param data - 공지사항 폼 입력 데이터
 * @returns API 요청 데이터 (id 제외)
 */
export const transformNoticeFormToRequest = (
  data: NoticeFormInput,
): Omit<NoticeCreateRequest, 'id'> => ({
  companyId: Number(data.companyId),
  title: data.title,
  content: data.content,
  active: data.active,
  top: data.top,
})
