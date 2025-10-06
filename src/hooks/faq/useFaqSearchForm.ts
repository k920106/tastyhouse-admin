'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getInitialFaqSearchForm } from '@/src/constants/faq'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { toApiPage } from '@/src/lib/pagination-utils'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import { isFaqSearchKey, type FaqSearchFormInput, type FaqSearchQuery } from '@/src/types/faq'
import { useFaqSearchWithQuery } from './useFaqSearchWithQuery'

// 검색 폼 유효성 검사 스키마 (Form 입력용)
const searchFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  companyName: z.string().optional(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.enum(['all', 'true', 'false']),
}) satisfies z.ZodType<FaqSearchFormInput>

// API 쿼리 변환 스키마 (Form → Query 변환)
export const faqSearchQuerySchema = searchFormSchema.transform((data): FaqSearchQuery => ({
  companyId: parseInt(data.companyId),
  title: data.title.trim() || null,
  startDate: data.startDate,
  endDate: data.endDate,
  active: data.active === 'all' ? null : data.active === 'true',
}))

/**
 * URL 쿼리스트링을 FaqSearchFormInput으로 파싱
 * 내부 헬퍼 함수로 사용
 */
const useFaqUrlSearchForm = (): FaqSearchFormInput => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const initialForm = getInitialFaqSearchForm()
    return parseSearchParamsToForm(
      searchParams,
      initialForm as unknown as Record<string, unknown>,
      isFaqSearchKey,
    ) as unknown as FaqSearchFormInput
  }, [searchParams])
}

export interface UseFaqSearchFormResult {
  form: ReturnType<typeof useForm<FaqSearchFormInput>>
  onSubmit: () => void
  isLoading: boolean
}

export const useFaqSearchForm = (): UseFaqSearchFormResult => {
  const { updateUrl, isLoading } = useFaqSearchWithQuery()

  // URL에서 초기값 파싱
  const urlSearchForm = useFaqUrlSearchForm()

  // 폼 초기화 (values로 자동 동기화)
  const form = useForm<FaqSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    values: urlSearchForm,
  })

  // 제출 로직
  const onSubmit = useCallback(() => {
    const formValues = form.getValues()
    updateUrl(formValues, toApiPage(INITIAL_PAGINATION.currentPage))
  }, [updateUrl, form])

  return {
    form,
    onSubmit,
    isLoading,
  }
}

// 외부에서 URL 파싱만 필요한 경우를 위해 export (필요시 사용)
export { useFaqUrlSearchForm }
