'use client'

import { Loader2Icon } from 'lucide-react'
import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Button } from '@/src/components/ui/Button'
import { Form } from '@/src/components/ui/Form'
import { useNoticeSearchForm } from '@/src/hooks/notice/useNoticeSearchForm'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'

import ActiveStatusSelectFilter from '@/src/components/forms/ActiveStatusSelectFilter'
import CompanyField from '@/src/components/forms/CompanyField'
import DateRangeField from '@/src/components/forms/DateRangeField'
import TextField from '@/src/components/forms/TextField'
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
        <BaseSearchForm
          actions={
            <>
              {/* <Link
                href={ROUTES.NOTICES.CREATE}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  isLoading && 'pointer-events-none opacity-50',
                )}
              >
                등록
              </Link> */}
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
          <CompanyField control={form.control} name="companyId" disabled={isLoading} />
          <TextField name="title" label="제목" control={form.control} disabled={isLoading} />
          <ActiveStatusSelectFilter control={form.control} name="active" disabled={isLoading} />
          <DateRangeField control={form.control} disabled={isLoading} />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default NoticeFilters
