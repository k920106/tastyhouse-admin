'use client'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { NoticeSearchFormInput } from '@/src/types/notice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useNoticesQuery, type NoticeQueryData } from '../queries/useNoticeQueries'
import { useToastError } from '../useToastError'

const parseIntSafely = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

export interface NoticeSearchWithQueryHookResult {
  // URL 기반 검색 폼 (실제 쿼리용)
  urlSearchForm: NoticeSearchFormInput

  // 페이지네이션
  currentPage: number
  pageSize: number

  // 데이터 쿼리 관련
  data: NoticeQueryData | undefined
  isLoading: boolean

  // 액션들
  updateUrl: (form: NoticeSearchFormInput, page?: number, size?: number) => void
}

export const useNoticeSearchWithQuery = (): NoticeSearchWithQueryHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 초기 검색 폼 값 (한 번만 생성)
  const initialSearchForm = useMemo(() => getInitialNoticeSearchForm(), [])

  // URL에서 현재 검색 조건 파싱 (실제 쿼리 실행용)
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, initialSearchForm),
    [searchParams, initialSearchForm],
  )

  // 페이지네이션 정보
  const currentPage = useMemo(
    () => parseIntSafely(searchParams.get('page'), INITIAL_PAGINATION.currentPage),
    [searchParams],
  )

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (form: NoticeSearchFormInput, page: number = INITIAL_PAGINATION.currentPage, size?: number) => {
      const targetSize = size ?? pageSize
      const params = buildSearchParams(
        form,
        initialSearchForm,
        page,
        targetSize,
      )
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router, pageSize, initialSearchForm],
  )

  // URL에 검색 파라미터가 있는지 확인 (쿼리 실행 여부 결정)
  const hasSearchParams = useMemo(() => searchParams.size > 0, [searchParams])

  // 데이터 쿼리 - URL에 검색 파라미터가 있을 때만 실행
  const { data, isLoading, error } = useNoticesQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    hasSearchParams,
  )

  useToastError(error, '공지사항 목록 조회 중 오류가 발생했습니다.')

  return {
    // URL 기반 검색 폼 (실제 쿼리용)
    urlSearchForm,

    // 페이지네이션
    currentPage,
    pageSize,

    // 데이터 쿼리 관련
    data,
    isLoading,

    // URL 관련
    updateUrl,
  }
}
