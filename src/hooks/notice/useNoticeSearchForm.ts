'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { toApiPage } from '@/src/lib/pagination-utils'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import {
  isNoticeSearchKey,
  type NoticeSearchFormInput,
  type NoticeSearchQuery,
} from '@/src/types/notice'
import { useNoticeSearchWithQuery } from './useNoticeSearchWithQuery'

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
}) satisfies z.ZodType<NoticeSearchFormInput>

export const noticeSearchQuerySchema = searchFormSchema.transform(
  (data): NoticeSearchQuery => ({
    companyId: parseInt(data.companyId),
    title: data.title.trim() || null,
    startDate: data.startDate,
    endDate: data.endDate,
    active: data.active === 'all' ? null : data.active === 'true',
  }),
)

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

  const urlSearchForm = useNoticeUrlSearchForm()

  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    values: urlSearchForm,
  })

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

export { useNoticeUrlSearchForm }
