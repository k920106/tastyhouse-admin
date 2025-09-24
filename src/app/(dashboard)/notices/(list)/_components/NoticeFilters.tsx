'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { type DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { LuCalendar } from 'react-icons/lu'

import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { cn } from '@/src/lib/class-utils'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { formatToAPIDate } from '@/src/lib/date-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { getNoticeUseStatusLabel, type NoticeSearchForm } from '@/src/types/notice'

const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
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

  // 날짜 범위 생성 - 단순화된 로직
  const startDate = form.watch('startDate')
  const endDate = form.watch('endDate')

  const dateRange: DateRange | undefined = (() => {
    const fromDate = startDate ? new Date(startDate) : undefined
    const toDate = endDate ? new Date(endDate) : undefined
    const validFrom = fromDate && !isNaN(fromDate.getTime()) ? fromDate : undefined
    const validTo = toDate && !isNaN(toDate.getTime()) ? toDate : undefined
    return validFrom || validTo ? { from: validFrom, to: validTo } : undefined
  })()

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    const newStartDate = range?.from ? formatToAPIDate(range.from) : ''
    const newEndDate = range?.to ? formatToAPIDate(range.to) : ''

    form.setValue('startDate', newStartDate)
    form.setValue('endDate', newEndDate)
  }

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
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">매체사</FormLabel>
                <FormControl>
                  <CompanySelector
                    label=""
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    loading={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">제목</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="font-semibold">등록일자</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    disabled={isLoading}
                    aria-label={dateRange?.from ? '선택된 날짜 범위 수정' : '날짜 범위 선택'}
                    aria-describedby="date-range-description"
                    aria-haspopup="dialog"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <LuCalendar className="h-4 w-4" />
                    {formatDateRangeDisplay(dateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    aria-label="날짜 범위 달력"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">사용 여부</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="true">{getNoticeUseStatusLabel(true)}</SelectItem>
                      <SelectItem value="false">{getNoticeUseStatusLabel(false)}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
}
