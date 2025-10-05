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

export type NoticeListItem = {
  id: number
  companyName: string
  title: string
  content: string
  active: boolean
  createdAt: string
}

export interface NoticeSearchFormInput {
  companyId: string
  title: string
  startDate: string
  endDate: string
  active: 'all' | 'true' | 'false'
}

export interface NoticeFormInput {
  companyId: string
  title: string
  content: string
  active: boolean
  top: boolean
}

// 별칭으로 유지 (하위 호환성)
export type NoticeCreateFormInput = NoticeFormInput
export type NoticeUpdateFormInput = NoticeFormInput

export const isNoticeSearchKey = (key: string): key is keyof NoticeSearchFormInput => {
  return ['companyId', 'title', 'startDate', 'endDate', 'active'].includes(key)
}

export interface NoticeSearchQuery {
  companyId: number
  title: string | null
  startDate: string
  endDate: string
  active: boolean | null
}

export interface NoticeCreateRequest {
  companyId: number
  title: string
  content: string
  active: boolean
  top: boolean
}

export interface NoticeUpdateRequest {
  companyId: number
  title: string
  content: string
  active: boolean
  top: boolean
}

export interface NoticeCreateResponse {
  id: number
}

export interface Notice {
  id: number
  companyId: number
  companyName: string
  title: string
  content: string
  active: boolean
  top: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}
