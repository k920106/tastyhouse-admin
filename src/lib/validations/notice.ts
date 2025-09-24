import { NoticeSearchForm, convertFormToQuery, NoticeSearchQuery } from '@/src/types/notice'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * 공지사항 검색 폼 검증
 */
export const validateNoticeSearchForm = (
  form: NoticeSearchForm,
  hasSearchParams?: boolean,
): ValidationResult => {
  // 검색 파라미터 여부가 제공되었고 없으면 쿼리 실행하지 않음
  if (hasSearchParams !== undefined && !hasSearchParams) {
    return {
      isValid: false,
      errors: [],
    }
  }

  const errors: string[] = []

  // 매체사 필수 검증
  if (!form.companyId || form.companyId === 'all' || form.companyId === '') {
    errors.push('매체사를 선택해 주세요')
  }

  // 날짜 범위 검증
  if (form.startDate && form.endDate) {
    const startDate = new Date(form.startDate)
    const endDate = new Date(form.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      errors.push('올바른 날짜 형식이 아닙니다')
    } else if (startDate > endDate) {
      errors.push('시작일이 종료일보다 늦을 수 없습니다')
    }
  }

  // 활성 상태 값 검증
  if (!['all', 'true', 'false'].includes(form.active)) {
    errors.push('올바른 사용 여부 값이 아닙니다')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 검색 폼을 API 쿼리로 변환하고 검증
 */
export const validateAndConvertNoticeSearchForm = (
  form: NoticeSearchForm,
  hasSearchParams?: boolean,
): { isValid: boolean; errors: string[]; query?: NoticeSearchQuery } => {
  const validation = validateNoticeSearchForm(form, hasSearchParams)

  if (!validation.isValid) {
    return validation
  }

  const query = convertFormToQuery(form)

  return {
    ...validation,
    query,
  }
}

/**
 * 빈 값 검증 유틸
 */
export const isEmptyValue = (value: string | undefined | null): boolean => {
  return !value || value === 'all' || value === ''
}
