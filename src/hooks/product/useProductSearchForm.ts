'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getInitialProductSearchForm } from '@/src/constants/product'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { toApiPage } from '@/src/lib/pagination-utils'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import {
  isProductSearchKey,
  type ProductSearchFormInput,
  type ProductSearchQuery,
} from '@/src/types/product'
import { useProductSearchWithQuery } from './useProductSearchWithQuery'

const searchFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  companyName: z.string().optional(),
  brandId: z.string(),
  supplyId: z.string(),
  productCode: z.string(),
  name: z.string(),
  display: z.enum(['all', 'true', 'false']),
  status: z.enum(['all', 'on_sale', 'sale_stopped', 'discontinued', 'fault_stopped']),
  startDate: z.string(),
  endDate: z.string(),
}) satisfies z.ZodType<ProductSearchFormInput>

export const productSearchQuerySchema = searchFormSchema.transform(
  (data): ProductSearchQuery => ({
    companyId: data.companyId === 'all' ? null : parseInt(data.companyId),
    brandId: data.brandId === 'all' ? null : parseInt(data.brandId),
    supplyId: data.supplyId === 'all' ? null : parseInt(data.supplyId),
    productCode: data.productCode.trim() || null,
    name: data.name.trim() || null,
    display: data.display === 'all' ? null : data.display === 'true',
    startDate: data.startDate,
    endDate: data.endDate,
  }),
)

const useProductUrlSearchForm = (): ProductSearchFormInput => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const initialForm = getInitialProductSearchForm()
    return parseSearchParamsToForm(
      searchParams,
      initialForm as unknown as Record<string, unknown>,
      isProductSearchKey,
    ) as unknown as ProductSearchFormInput
  }, [searchParams])
}

export interface UseProductSearchFormResult {
  form: ReturnType<typeof useForm<ProductSearchFormInput>>
  onSubmit: () => void
  isLoading: boolean
}

export const useProductSearchForm = (): UseProductSearchFormResult => {
  const { updateUrl, isLoading } = useProductSearchWithQuery()

  const urlSearchForm = useProductUrlSearchForm()

  const form = useForm<ProductSearchFormInput>({
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

export { useProductUrlSearchForm }
