'use client'

import React, { useCallback } from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Form } from '@/src/components/ui/Form'
import { useFaqSearchWithQuery } from '@/src/hooks/faq/useFaqSearchWithQuery'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'

import ActiveStatusSelectField from '@/src/components/forms/field/ActiveStatusSelectField'
import CompanyField from '@/src/components/forms/field/CompanyField'
import TextField from '@/src/components/forms/field/TextField'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { handleFormError } from '@/src/lib/form-utils'
import { toApiPage } from '@/src/lib/pagination-utils'
import { faqSearchFormSchema } from '@/src/lib/schemas/faq-schema'
import { FaqSearchFormInput } from '@/src/types/faq'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const FaqFilters = React.memo(function FaqFilters() {
  const { urlSearchForm, updateUrl, isLoading } = useFaqSearchWithQuery()

  const form = useForm<FaqSearchFormInput>({
    resolver: zodResolver(faqSearchFormSchema),
    values: urlSearchForm,
  })

  const onSubmit = useCallback(() => {
    const formValues = form.getValues()
    updateUrl(formValues, toApiPage(INITIAL_PAGINATION.currentPage))
  }, [updateUrl, form])

  const { handleKeyDown } = useSearchFormKeyboard({
    onSubmit,
    isLoading,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} onKeyDown={handleKeyDown}>
        <BaseSearchForm isLoading={isLoading}>
          <CompanyField
            control={form.control}
            name="companyId"
            disabled={isLoading}
            syncCompanyName={true}
            label="매체사"
          />
          <TextField name="title" label="제목" control={form.control} disabled={isLoading} />
          <ActiveStatusSelectField
            control={form.control}
            name="active"
            disabled={isLoading}
            label="활성상태"
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default FaqFilters
