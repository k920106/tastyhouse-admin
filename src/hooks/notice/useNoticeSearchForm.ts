'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { type NoticeSearchFormInput } from '@/src/types/notice'

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

export interface UseNoticeSearchFormResult {
  // 폼 관련
  form: ReturnType<typeof useForm<NoticeSearchFormInput>>

  // 액션
  onSubmit: () => void
}

export const useNoticeSearchForm = (): UseNoticeSearchFormResult => {
  const { urlSearchForm, updateUrl } = useNoticeSearchContext()

  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: urlSearchForm,
  })

  // URL 변경 시에만 폼 리셋 (매 렌더링마다 리셋하지 않음)
  useEffect(() => {
    form.reset(urlSearchForm)
  }, [urlSearchForm, form])

  const onSubmit = useCallback(() => {
    const formValues = form.getValues()
    console.log(formValues)
    updateUrl(formValues, INITIAL_PAGINATION.currentPage)
  }, [updateUrl, form])

  return {
    form,
    onSubmit,
  }
}
