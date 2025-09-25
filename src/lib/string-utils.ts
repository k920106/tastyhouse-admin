/**
 * 문자열 관련 유틸리티 함수들
 */

/**
 * 빈 값 검증 유틸
 */
export const isEmptyValue = (value: string | undefined | null): boolean => {
  return !value || value === 'all' || value === ''
}
