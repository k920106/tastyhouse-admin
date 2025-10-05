'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import * as z from 'zod'

import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import { isNoticeSearchKey, type NoticeSearchFormInput } from '@/src/types/notice'
import { useNoticeSearchContext } from '@/src/contexts/NoticeSearchContext'

// 검색 폼 스키마
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
}

export const useNoticeSearchForm = (): UseNoticeSearchFormResult => {
  const { updateUrl } = useNoticeSearchContext()

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
  }
}

// 외부에서 URL 파싱만 필요한 경우를 위해 export (필요시 사용)
export { useNoticeUrlSearchForm }

