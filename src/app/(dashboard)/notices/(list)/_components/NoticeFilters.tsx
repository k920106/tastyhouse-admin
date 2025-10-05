'use client'

import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Form } from '@/src/components/ui/Form'
import { ROUTES } from '@/src/constants/routes'
import { useNoticeSearchContext } from '@/src/contexts/NoticeSearchContext'
import { useNoticeSearchForm } from '@/src/hooks/notice/useNoticeSearchForm'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'
import { cn } from '@/src/lib/class-utils'

import ActiveStatusSelectFilter from '@/src/components/forms/ActiveStatusSelectFilter'
import CompanyField from '@/src/components/forms/CompanyField'
import TextField from '@/src/components/forms/TextField'
import { handleFormError } from '@/src/lib/form-utils'

import DateRangeField from './fields/DateRangeField'

const NoticeFilters = React.memo(function NoticeFilters() {
  const { form, onSubmit } = useNoticeSearchForm()
  const { isLoading } = useNoticeSearchContext()

  const { handleKeyDown } = useSearchFormKeyboard({
    onSubmit,
    isLoading,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} onKeyDown={handleKeyDown}>
        <BaseSearchForm
          actions={
            <>
              <Link
                href={ROUTES.NOTICES.CREATE}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  isLoading && 'pointer-events-none opacity-50',
                )}
              >
                등록
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    조회 중...
                  </>
                ) : (
                  '조회'
                )}
              </Button>
            </>
          }
        >
          <CompanyField control={form.control} name="companyId" isLoading={isLoading} />
          <TextField name="title" label="제목" control={form.control} isLoading={isLoading} />
          <DateRangeField control={form.control} isLoading={isLoading} />
          <ActiveStatusSelectFilter control={form.control} name="active" isLoading={isLoading} />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default NoticeFilters
