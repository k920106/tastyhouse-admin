export type NoticeListItem = {
  id: number
  companyName: string
  title: string
  content: string
  isUse: boolean
  createdAt: string
}

export interface NoticeSearchForm extends Record<string, string> {
  companyId: string
  title: string
  startDate: string
  endDate: string
  active: string
}

export type NoticeCreateRequest = {
  companyId: number
  title: string
  content: string
  isUse: boolean
  isTop: boolean
}

// 사용 여부
export const NOTICE_USE_STATUS = {
  USE: { value: 'true', label: '사용' },
  NOT_USE: { value: 'false', label: '미사용' },
} as const

export type NoticeUseStatus = (typeof NOTICE_USE_STATUS)[keyof typeof NOTICE_USE_STATUS]

// 상단 고정 여부
export const NOTICE_TOP_STATUS = {
  TOP: { value: 'true', label: '적용' },
  NOT_TOP: { value: 'false', label: '미적용' },
} as const

export type NoticeTopStatus = (typeof NOTICE_TOP_STATUS)[keyof typeof NOTICE_TOP_STATUS]

// 유틸리티 함수
export const getNoticeUseStatusLabel = (isUse: boolean): string => {
  return isUse ? NOTICE_USE_STATUS.USE.label : NOTICE_USE_STATUS.NOT_USE.label
}

export const getNoticeTopStatusLabel = (isTop: boolean): string => {
  return isTop ? NOTICE_TOP_STATUS.TOP.label : NOTICE_TOP_STATUS.NOT_TOP.label
}
