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

// 사용 여부
export const NOTICE_USE_STATUS = {
  USE: { value: true, label: '사용' },
  NOT_USE: { value: false, label: '미사용' },
} as const

export type NoticeUseStatus = (typeof NOTICE_USE_STATUS)[keyof typeof NOTICE_USE_STATUS]

// 유틸리티 함수
export const getNoticeUseStatusLabel = (isUse: boolean): string => {
  return isUse ? NOTICE_USE_STATUS.USE.label : NOTICE_USE_STATUS.NOT_USE.label
}
