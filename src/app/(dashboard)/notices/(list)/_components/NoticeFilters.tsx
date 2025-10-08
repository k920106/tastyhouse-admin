'use client'

import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Form } from '@/src/components/ui/Form'
import { useNoticeSearchForm } from '@/src/hooks/notice/useNoticeSearchForm'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'

import ActiveStatusSelectField from '@/src/components/forms/field/ActiveStatusSelectField'
import CompanyField from '@/src/components/forms/field/CompanyField'
import DateRangeField from '@/src/components/forms/field/DateRangeField'
import TextField from '@/src/components/forms/field/TextField'
import { handleFormError } from '@/src/lib/form-utils'

const NoticeFilters = React.memo(function NoticeFilters() {
  const { form, onSubmit, isLoading } = useNoticeSearchForm()

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
          <DateRangeField
            control={form.control}
            name="startDate"
            disabled={isLoading}
            label="등록일자"
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default NoticeFilters
