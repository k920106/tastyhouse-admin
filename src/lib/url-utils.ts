import { INITIAL_PAGINATION } from '@/src/lib/constants'

/**
 * URL 쿼리 파라미터를 지정된 폼 타입으로 변환하는 범용 함수
 * @param searchParams - URL 검색 파라미터
 * @param defaultForm - 기본 폼 값 (타입 추론을 위한 템플릿)
 * @param isValidKey - 타입 가드 함수 (타입 안정성 강화)
 */
export function parseSearchParamsToForm<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  defaultForm: T,
  isValidKey: (key: string) => boolean,
): T {
  const result = { ...defaultForm }

  for (const key of Object.keys(defaultForm)) {
    if (!isValidKey(key)) {
      continue
    }

    const value = searchParams.get(key)
    if (value !== null) {
      result[key as keyof T] = value as T[keyof T]
    }
  }

  return result
}

/**
 * 폼 데이터를 URL 쿼리 파라미터로 변환하는 범용 함수
 * @param form - 폼 데이터
 * @param defaultForm - 기본 폼 값 (초기값 비교용)
 * @param currentPage - 현재 페이지 (선택)
 * @param pageSize - 페이지 크기 (선택)
 * @param isValidKey - 타입 가드 함수 (타입 안정성 강화)
 */
export function buildSearchParams<T extends Record<string, unknown>>(
  form: T,
  defaultForm: T,
  currentPage?: number,
  pageSize?: number,
  isValidKey?: (key: string) => boolean,
): URLSearchParams {
  const params = new URLSearchParams()

  // 검색 폼 파라미터 추가 (초기값과 다른 경우만)
  for (const [key, value] of Object.entries(form)) {
    // 타입 가드가 제공되고 검증 실패 시 스킵
    if (isValidKey && !isValidKey(key)) {
      continue
    }

    const stringValue = String(value)
    if (stringValue && stringValue !== 'all' && stringValue !== String(defaultForm[key as keyof T])) {
      params.set(key, stringValue)
    }
  }

  // 페이지네이션 파라미터 추가 (초기값과 다른 경우만)
  if (currentPage !== undefined && currentPage !== INITIAL_PAGINATION.currentPage) {
    params.set('page', currentPage.toString())
  }
  if (pageSize !== undefined && pageSize !== INITIAL_PAGINATION.pageSize) {
    params.set('pageSize', pageSize.toString())
  }

  return params
}
