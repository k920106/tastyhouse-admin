'use client'

import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Form } from '@/src/components/ui/Form'
import { ROUTES } from '@/src/constants/routes'
import { useNoticeSearchForm } from '@/src/hooks/notice/useNoticeSearchForm'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'
import { cn } from '@/src/lib/class-utils'

import ActiveStatusField from './fields/ActiveStatusField'
import CompanyField from './fields/CompanyField'
import DateRangeField from './fields/DateRangeField'
import TitleField from './fields/TitleField'

const NoticeFilters = React.memo(function NoticeFilters() {
  // 검색 로직은 커스텀 훅에서 처리
  const { form, isLoading, handleSubmit } = useNoticeSearchForm()

  // 키보드 이벤트 핸들러 (커스텀 훅 사용)
  const { handleKeyDown } = useSearchFormKeyboard({
    onSubmit: handleSubmit,
    isLoading,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} onKeyDown={handleKeyDown}>
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
          <CompanyField control={form.control} isLoading={isLoading} />
          <TitleField control={form.control} isLoading={isLoading} />
          <DateRangeField watch={form.watch} setValue={form.setValue} isLoading={isLoading} />
          <ActiveStatusField control={form.control} isLoading={isLoading} />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default NoticeFilters
