import { INITIAL_PAGINATION } from '@/src/lib/constants'

/**
 * URL 쿼리 파라미터를 지정된 폼 타입으로 변환하는 범용 함수
 */
export const parseSearchParamsToForm = <T extends Record<string, string>>(
  searchParams: URLSearchParams,
  defaultForm: T,
): T => {
  const result = {} as T

  Object.keys(defaultForm).forEach((key) => {
    result[key as keyof T] = (searchParams.get(key) ?? defaultForm[key as keyof T]) as T[keyof T]
  })

  return result
}

/**
 * 폼 데이터를 URL 쿼리 파라미터로 변환하는 범용 함수
 */
export const buildSearchParams = <T extends Record<string, string>>(
  form: T,
  defaultForm: T,
  currentPage?: number,
  pageSize?: number,
): URLSearchParams => {
  const params = new URLSearchParams()

  // 검색 폼 파라미터 추가 (초기값과 다른 경우만)
  Object.entries(form).forEach(([key, value]) => {
    const stringValue = String(value)
    if (stringValue && stringValue !== 'all' && stringValue !== String(defaultForm[key as keyof T])) {
      params.set(key, stringValue)
    }
  })

  // 페이지네이션 파라미터 추가 (초기값과 다른 경우만)
  if (currentPage !== undefined && currentPage !== INITIAL_PAGINATION.currentPage) {
    params.set('page', currentPage.toString())
  }
  if (pageSize !== undefined && pageSize !== INITIAL_PAGINATION.pageSize) {
    params.set('pageSize', pageSize.toString())
  }

  return params
}
