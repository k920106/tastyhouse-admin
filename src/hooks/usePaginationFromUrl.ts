'use client'

import { INITIAL_PAGINATION } from '@/src/lib/constants'
import {
  toUrlPage,
  urlPageToApiPage,
  type ApiPage,
} from '@/src/lib/pagination-utils'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

/**
 * 문자열을 안전하게 정수로 파싱합니다.
 * @param value - 파싱할 문자열 (null 가능)
 * @param fallback - 파싱 실패 시 기본값
 * @returns 파싱된 정수 또는 기본값
 */
const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * URL에서 페이지네이션 정보를 추출하는 훅의 반환 타입
 */
export interface PaginationFromUrlResult {
  /** API에서 사용하는 페이지 번호 (0-based) */
  currentPage: ApiPage
  /** 페이지당 항목 수 */
  pageSize: number
}

/**
 * URL 쿼리 파라미터에서 페이지네이션 정보를 추출하는 커스텀 훅
 *
 * URL에서 `page`와 `pageSize` 파라미터를 읽어와서 API용 페이지 번호로 변환합니다.
 * - `page`: URL에서는 1-based, API에서는 0-based로 자동 변환
 * - `pageSize`: 기본값 INITIAL_PAGINATION.pageSize 사용
 *
 * @example
 * ```tsx
 * const { currentPage, pageSize } = usePaginationFromUrl()
 * // URL이 ?page=2&pageSize=20인 경우
 * // currentPage: 1 (API용 0-based)
 * // pageSize: 20
 * ```
 *
 * @returns 현재 페이지 번호와 페이지 크기를 담은 객체
 */
export function usePaginationFromUrl(): PaginationFromUrlResult {
  const searchParams = useSearchParams()

  const currentPage: ApiPage = useMemo(() => {
    const pageFromUrl = parseIntSafely(searchParams.get('page'), 1)
    return urlPageToApiPage(toUrlPage(pageFromUrl))
  }, [searchParams])

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  return { currentPage, pageSize }
}
