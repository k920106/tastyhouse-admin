export type NoticeListItem = {
  id: number
  companyName: string
  title: string
  content: string
  active: boolean
  createdAt: string
}

// 검색 폼에서 사용하는 활성 상태 타입
export type NoticeActiveFilter = 'all' | 'true' | 'false'

// 폼 입력용 타입 (각 필드별 명확한 타입 정의)
export interface NoticeSearchFormInput {
  companyId: string
  title: string
  startDate: string
  endDate: string
  active: NoticeActiveFilter
}

export interface NoticeCreateFormInput {
  companyId: string
  title: string
  content: string
  active: boolean
  top: boolean
}

// 타입 가드: 문자열이 NoticeSearchFormInput의 키인지 확인
export const isNoticeSearchKey = (key: string): key is keyof NoticeSearchFormInput => {
  return ['companyId', 'title', 'startDate', 'endDate', 'active'].includes(key)
}

// API 요청용 타입 (실제 서버로 전송될 때)
export interface NoticeSearchQuery {
  companyId?: number
  title?: string
  startDate?: string
  endDate?: string
  active?: boolean
}

export interface NoticeCreateRequest {
  companyId: number
  title: string
  content: string
  active: boolean
  top: boolean
}

export interface NoticeCreateResponse {
  id: number
}

// 상단 고정 여부
export const NOTICE_TOP_STATUS = {
  TOP: { value: 'true', label: '적용' },
  NOT_TOP: { value: 'false', label: '미적용' },
} as const

export type NoticeTopStatus = (typeof NOTICE_TOP_STATUS)[keyof typeof NOTICE_TOP_STATUS]

// 유틸리티 함수
export const getNoticeTopStatusLabel = (top: boolean): string => {
  return top ? NOTICE_TOP_STATUS.TOP.label : NOTICE_TOP_STATUS.NOT_TOP.label
}

// 검색 폼을 API 쿼리로 변환하는 함수
export const convertFormToQuery = (form: NoticeSearchFormInput): NoticeSearchQuery => {
  const query: NoticeSearchQuery = {}

  // companyId: 빈 문자열이 아니고 'all'이 아닐 때만 포함
  const companyIdNum = form.companyId ? parseInt(form.companyId, 10) : NaN
  if (!isNaN(companyIdNum) && form.companyId !== 'all' && form.companyId !== '') {
    query.companyId = companyIdNum
  }

  // title: 빈 문자열이 아닐 때만 포함
  if (form.title.trim()) {
    query.title = form.title.trim()
  }

  // 날짜 범위: 유효한 날짜일 때만 포함
  if (form.startDate) {
    query.startDate = form.startDate
  }
  if (form.endDate) {
    query.endDate = form.endDate
  }

  if (form.active !== 'all') {
    query.active = form.active === 'true'
  }

  return query
}
