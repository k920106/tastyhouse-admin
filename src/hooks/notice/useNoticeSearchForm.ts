'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { type NoticeSearchFormInput } from '@/src/types/notice'

import { useNoticeSearchContext } from '@/src/contexts/NoticeSearchContext'

// 검색 폼 스키마
const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.enum(['all', 'true', 'false']),
}) satisfies z.ZodType<NoticeSearchFormInput>

export interface UseNoticeSearchFormResult {
  // 폼 관련
  form: ReturnType<typeof useForm<NoticeSearchFormInput>>

  // 액션
  handleSubmit: () => void
}

export const useNoticeSearchForm = (): UseNoticeSearchFormResult => {
  const { urlSearchForm, updateUrl } = useNoticeSearchContext()

  // URL 상태를 기반으로 한 기본값 메모이제이션
  const defaultValues = useMemo(
    () => ({
      companyId: urlSearchForm.companyId ?? '',
      title: urlSearchForm.title ?? '',
      startDate: urlSearchForm.startDate ?? '',
      endDate: urlSearchForm.endDate ?? '',
      active: urlSearchForm.active ?? '',
    }),
    [urlSearchForm],
  )

  // React Hook Form 설정
  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    values: defaultValues,
  })

  // 폼 제출 핸들러
  const handleSubmit = useCallback(() => {
    const formValues = form.getValues()
    const validation = validateNoticeSearchForm(formValues)

    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 초기 페이지로 리셋)
    updateUrl(formValues, INITIAL_PAGINATION.currentPage)
  }, [form, updateUrl])

  return {
    form,
    handleSubmit,
  }
}
