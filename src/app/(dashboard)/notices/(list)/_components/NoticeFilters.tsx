'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Form } from '@/src/components/ui/Form'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'
import { cn } from '@/src/lib/class-utils'
import { INITIAL_PAGINATION } from '@/src/lib/constants'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { ROUTES } from '@/src/constants/routes'
import { type NoticeSearchFormInput } from '@/src/types/notice'

import ActiveStatusField from './fields/ActiveStatusField'
import CompanyField from './fields/CompanyField'
import DateRangeField from './fields/DateRangeField'
import TitleField from './fields/TitleField'

const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.enum(['all', 'true', 'false']),
}) satisfies z.ZodType<NoticeSearchFormInput>

const NoticeFilters = React.memo(function NoticeFilters() {
  const { urlSearchForm, isLoading, updateUrl } = useNoticeSearchWithQuery()

  // URL 상태를 기반으로 한 기본값 메모이제이션
  const defaultValues = useMemo(
    () => ({
      companyId: urlSearchForm.companyId ?? '',
      title: urlSearchForm.title ?? '',
      startDate: urlSearchForm.startDate ?? '',
      endDate: urlSearchForm.endDate ?? '',
      active: urlSearchForm.active ?? '',
    }),
    [urlSearchForm],
  )

  // React Hook Form 설정 - 메모이제이션된 기본값 사용
  const form = useForm<NoticeSearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    values: defaultValues, // defaultValues 대신 values 사용으로 자동 리셋 처리
  })

  // 폼 제출 핸들러 - useCallback으로 메모이제이션
  const handleSubmit = useCallback(() => {
    // 로딩 중이면 제출 방지
    if (isLoading) {
      return
    }

    const formValues = form.getValues()
    const validation = validateNoticeSearchForm(formValues)

    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 초기 페이지로 리셋)
    updateUrl(formValues, INITIAL_PAGINATION.currentPage)
  }, [isLoading, form, updateUrl])

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
