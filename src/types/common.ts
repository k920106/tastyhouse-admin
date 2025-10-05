export interface ValidationResult {
  isValid: boolean
  error?: string
}

// 활성상태
export const ACTIVE_STATUS = {
  ACTIVE: { value: 'true', label: '활성' },
  NOT_ACTIVE: { value: 'false', label: '미활성' },
} as const

export type ActiveStatus = (typeof ACTIVE_STATUS)[keyof typeof ACTIVE_STATUS]

// 유틸리티 함수
export const getActiveStatusLabel = (active: boolean): string => {
  return active ? ACTIVE_STATUS.ACTIVE.label : ACTIVE_STATUS.NOT_ACTIVE.label
}
