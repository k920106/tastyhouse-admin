'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import {
  isNoticeSearchKey,
  type NoticeSearchFormInput,
  type NoticeSearchQuery,
} from '@/src/types/notice'
import { useNoticeSearchWithQuery } from './useNoticeSearchWithQuery'

// 검색 폼 유효성 검사 스키마 (Form 입력용)
const searchFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.enum(['all', 'true', 'false']),
}) satisfies z.ZodType<NoticeSearchFormInput>

// API 쿼리 변환 스키마 (Form → Query 변환)
export const noticeSearchQuerySchema = searchFormSchema.transform(
  (data): NoticeSearchQuery => ({
    companyId: parseInt(data.companyId),
    title: data.title.trim() || null,
    startDate: data.startDate,
    endDate: data.endDate,
    active: data.active === 'all' ? null : data.active === 'true',
  }),
)

/**
 * URL 쿼리스트링을 NoticeSearchFormInput으로 파싱
 * 내부 헬퍼 함수로 사용
 */
const useNoticeUrlSearchForm = (): NoticeSearchFormInput => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const initialForm = getInitialNoticeSearchForm()
    return parseSearchParamsToForm(
      searchParams,
      initialForm as unknown as Record<string, unknown>,
      isNoticeSearchKey,
    ) as unknown as NoticeSearchFormInput
  }, [searchParams])
}

export interface UseNoticeSearchFormResult {
  form: ReturnType<typeof useForm<NoticeSearchFormInput>>
  onSubmit: () => void
  isLoading: boolean
}

export const useNoticeSearchForm = (): UseNoticeSearchFormResult => {
  const { updateUrl, isLoading } = useNoticeSearchWithQuery()

  // URL에서 초기값 파싱
  const urlSearchForm = useNoticeUrlSearchForm()

  // 폼 초기화 (values로 자동 동기화)
  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    values: urlSearchForm,
  })

  // 제출 로직
  const onSubmit = useCallback(() => {
    const formValues = form.getValues()
    updateUrl(formValues, INITIAL_PAGINATION.currentPage)
  }, [updateUrl, form])

  return {
    form,
    onSubmit,
    isLoading,
  }
}

// 외부에서 URL 파싱만 필요한 경우를 위해 export (필요시 사용)
export { useNoticeUrlSearchForm }
