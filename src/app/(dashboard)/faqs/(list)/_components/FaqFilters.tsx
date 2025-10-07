'use client'

import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Form } from '@/src/components/ui/Form'
import { useFaqSearchForm } from '@/src/hooks/faq/useFaqSearchForm'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'

import ActiveStatusSelectFilter from '@/src/components/forms/ActiveStatusSelectFilter'
import CompanyField from '@/src/components/forms/CompanyField'
import TextField from '@/src/components/forms/TextField'
import { handleFormError } from '@/src/lib/form-utils'

const FaqFilters = React.memo(function FaqFilters() {
  const { form, onSubmit, isLoading } = useFaqSearchForm()

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
          />
          <TextField name="title" label="제목" control={form.control} disabled={isLoading} />
          <ActiveStatusSelectFilter control={form.control} name="active" disabled={isLoading} />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default FaqFilters
