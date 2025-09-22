'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { NoticeSearchForm } from '@/src/types/notice'
import { toast } from 'sonner'
import { parseSearchParamsToForm, buildSearchParams } from '@/src/lib/url-utils'
import { INITIAL_NOTICE_SEARCH_FORM } from '@/src/constants/notice'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'

export interface NoticeSearchFormHookResult {
  // 검색 폼 상태 (로컬)
  searchForm: NoticeSearchForm
  updateSearchForm: (updates: Partial<NoticeSearchForm>) => void

  // URL 기반 검색 폼 (실제 쿼리용)
  urlSearchForm: NoticeSearchForm
  shouldExecuteQuery: boolean

  // 검색 액션
  handleSearch: () => void
}

export const useNoticeSearchForm = (): NoticeSearchFormHookResult => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 로컬 검색 폼 상태 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [searchForm, setSearchForm] = useState<NoticeSearchForm>(initialSearchForm)

  // URL에서 현재 검색 조건 파싱 (실제 쿼리 실행용)
  const urlSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    [searchParams],
  )

  // 검색 버튼 클릭 시에만 쿼리 실행
  const shouldExecuteQuery = useMemo(() => {
    return searchParams.size > 0
  }, [searchParams])

  // URL 업데이트 헬퍼
  const updateUrl = useCallback(
    (form: NoticeSearchForm, page: number = 0) => {
      const params = buildSearchParams(form, INITIAL_NOTICE_SEARCH_FORM, page)
      const url = params.toString() ? `?${params.toString()}` : ''
      router.push(url, { scroll: false })
    },
    [router],
  )

  // 안전한 폼 업데이트 헬퍼 함수
  const safeUpdateForm = useCallback(
    (prev: NoticeSearchForm, updates: Partial<NoticeSearchForm>): NoticeSearchForm => {
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined),
      )

      return {
        companyId: filteredUpdates.companyId ?? prev.companyId,
        title: filteredUpdates.title ?? prev.title,
        startDate: filteredUpdates.startDate ?? prev.startDate,
        endDate: filteredUpdates.endDate ?? prev.endDate,
        active: filteredUpdates.active ?? prev.active,
      }
    },
    [],
  )

  // 검색 폼 업데이트
  const updateSearchForm = useCallback((updates: Partial<NoticeSearchForm>) => {
    setSearchForm((prev) => safeUpdateForm(prev, updates))
  }, [safeUpdateForm])

  // 검색 실행
  const handleSearch = useCallback(() => {
    const validation = validateNoticeSearchForm(searchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행
    updateUrl(searchForm, 0)
  }, [searchForm, updateUrl])

  return {
    searchForm,
    urlSearchForm,
    shouldExecuteQuery,
    updateSearchForm,
    handleSearch,
  }
}
