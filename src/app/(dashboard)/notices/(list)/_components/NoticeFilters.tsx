'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Form } from '@/src/components/ui/Form'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { cn } from '@/src/lib/class-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { type NoticeSearchForm } from '@/src/types/notice'

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
}) satisfies z.ZodType<NoticeSearchForm>

export default function NoticeFilters() {
  const { urlSearchForm, isLoading, updateUrl } = useNoticeSearchWithQuery()

  // React Hook Form 설정 - URL 상태를 직접 사용
  const form = useForm<NoticeSearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      companyId: urlSearchForm.companyId ?? '',
      title: urlSearchForm.title ?? '',
      startDate: urlSearchForm.startDate ?? '',
      endDate: urlSearchForm.endDate ?? '',
      active: urlSearchForm.active ?? '',
    },
  })

  // URL 상태가 변경되면 폼 리셋
  useEffect(() => {
    form.reset({
      companyId: urlSearchForm.companyId ?? '',
      title: urlSearchForm.title ?? '',
      startDate: urlSearchForm.startDate ?? '',
      endDate: urlSearchForm.endDate ?? '',
      active: urlSearchForm.active ?? '',
    })
  }, [form, urlSearchForm])

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const formValues = form.getValues()
    const validation = validateNoticeSearchForm(formValues)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 0으로 리셋)
    updateUrl(formValues, 0)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <>
              <Link
                href={isLoading ? '#' : '/notices/create'}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  isLoading && 'pointer-events-none opacity-50',
                )}
                aria-disabled={isLoading}
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
}
