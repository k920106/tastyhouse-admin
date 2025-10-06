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

export const faqSearchQuerySchema = searchFormSchema.transform(
  (data): FaqSearchQuery => ({
    companyId: parseInt(data.companyId),
    title: data.title.trim() || null,
    startDate: data.startDate,
    endDate: data.endDate,
    active: data.active === 'all' ? null : data.active === 'true',
  }),
)

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

  const urlSearchForm = useFaqUrlSearchForm()

  const form = useForm<FaqSearchFormInput>({
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

export { useFaqUrlSearchForm }
