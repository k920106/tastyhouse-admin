import { isEmptyValue } from '@/src/lib/string-utils'
import { ValidationResult } from '@/src/types/common'
import { NoticeSearchFormInput } from '@/src/types/notice'

/**
 * 공지사항 검색 폼 검증
 */
export const validateNoticeSearchForm = (
  form: NoticeSearchFormInput,
  hasSearchParams?: boolean,
): ValidationResult => {
  // 검색 파라미터 여부가 제공되었고 없으면 쿼리 실행하지 않음
  if (hasSearchParams !== undefined && !hasSearchParams) {
    return {
      isValid: false,
      error: '입력값을 확인해 주세요',
    }
  }

  // 매체사 필수 검증
  if (isEmptyValue(form.companyId)) {
    return {
      isValid: false,
      error: '매체사를 선택해 주세요',
    }
  }

  // 날짜 범위 검증
  if (form.startDate && form.endDate) {
    const startDate = new Date(form.startDate)
    const endDate = new Date(form.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        isValid: false,
        error: '올바른 날짜 형식이 아닙니다',
      }
    } else if (startDate > endDate) {
      return {
        isValid: false,
        error: '시작일이 종료일보다 늦을 수 없습니다',
      }
    }
  }

  // 활성 상태 값 검증
  if (!['all', 'true', 'false'].includes(form.active)) {
    return {
      isValid: false,
      error: '올바른 사용 여부 값이 아닙니다',
    }
  }

  return {
    isValid: true,
  }
}
