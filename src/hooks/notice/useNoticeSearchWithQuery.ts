'use client'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { apiPageToUrlPage, urlPageToApiPage } from '@/src/lib/pagination-utils'
import { buildSearchParams } from '@/src/lib/url-utils'
import { NoticeSearchFormInput, isNoticeSearchKey } from '@/src/types/notice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useNoticesQuery, type NoticeQueryData } from '../queries/useNoticeQueries'
import { useToastError } from '../useToastError'
import { useNoticeUrlSearchForm } from './useNoticeSearchForm'

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
  updateUrl: (form?: Partial<NoticeSearchFormInput> | null, page?: number, size?: number) => void
}

// 초기 검색 폼 값 (컴포넌트 외부에서 한 번만 생성)
const initialSearchForm = getInitialNoticeSearchForm()

export const useNoticeSearchWithQuery = (): NoticeSearchWithQueryHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL 파싱 로직을 별도 훅으로 분리
  const urlSearchForm = useNoticeUrlSearchForm()

  // 페이지네이션 정보 (URL은 1-based, API는 0-based)
  const currentPage = useMemo(() => {
    const pageFromUrl = parseIntSafely(searchParams.get('page'), 1)
    return urlPageToApiPage(pageFromUrl)
  }, [searchParams])

  const pageSize = useMemo(
    () => parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize),
    [searchParams],
  )

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (formOverride?: Partial<NoticeSearchFormInput> | null, page?: number, size?: number) => {
      // formOverride가 null이면 현재 폼 유지, 있으면 병합
      const finalForm = (
        formOverride ? { ...urlSearchForm, ...formOverride } : urlSearchForm
      ) as NoticeSearchFormInput

      // page는 0-based로 전달되므로 URL에 저장할 때 1-based로 변환
      const targetPage = page ?? INITIAL_PAGINATION.currentPage
      const targetPageForUrl = apiPageToUrlPage(targetPage) // URL용 1-based로 변환

      const targetSize =
        size ?? parseIntSafely(searchParams.get('pageSize'), INITIAL_PAGINATION.pageSize)

      const params = buildSearchParams(
        finalForm as unknown as Record<string, unknown>,
        initialSearchForm as unknown as Record<string, unknown>,
        targetPageForUrl,
        targetSize,
        isNoticeSearchKey,
      )

      const url = params.toString() ? `?${params.toString()}` : ''

      router.push(url, { scroll: false })
    },
    [router, searchParams, urlSearchForm],
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
