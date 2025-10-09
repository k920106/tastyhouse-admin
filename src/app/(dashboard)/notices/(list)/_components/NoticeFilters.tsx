'use client'

import React, { useCallback } from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Form } from '@/src/components/ui/Form'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'

import ActiveStatusSelectField from '@/src/components/forms/field/ActiveStatusSelectField'
import CompanyField from '@/src/components/forms/field/CompanyField'
import DateRangeField from '@/src/components/forms/field/DateRangeField'
import TextField from '@/src/components/forms/field/TextField'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { handleFormError } from '@/src/lib/form-utils'
import { toApiPage } from '@/src/lib/pagination-utils'
import { noticeSearchFormSchema } from '@/src/lib/schemas/notice-schema'
import { NoticeSearchFormInput } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const NoticeFilters = React.memo(function NoticeFilters() {
  const { urlSearchForm, updateUrl, isLoading } = useNoticeSearchWithQuery()

  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(noticeSearchFormSchema),
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
