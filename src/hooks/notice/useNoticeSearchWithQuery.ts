'use client'

import { INITIAL_NOTICE_SEARCH_FORM } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { buildSearchParams, parseSearchParamsToForm } from '@/src/lib/url-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
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

  // URL에서 현재 검색 조건 파싱 (실제 쿼리 실행용)
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    [searchParams],
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
        INITIAL_NOTICE_SEARCH_FORM,
        page,
        targetSize,
      )
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router, pageSize],
  )

  // URL에 검색 파라미터가 있는지 메모이제이션
  const hasSearchParams = useMemo(() => searchParams.size > 0, [searchParams])

  // URL 기반 검색 폼 검증 (searchParams 여부 포함)
  const validation = useMemo(
    () => validateNoticeSearchForm(urlSearchForm, hasSearchParams),
    [urlSearchForm, hasSearchParams],
  )

  // 데이터 쿼리
  const { data, isLoading, error } = useNoticesQuery(
    {
      searchForm: urlSearchForm,
      pagination: {
        page: currentPage,
        size: pageSize,
      },
    },
    validation.isValid,
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
