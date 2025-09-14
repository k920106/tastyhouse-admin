'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import SearchActions from '@/src/components/forms/SearchActions'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { type NoticeSearchForm, getNoticeUseStatusLabel } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatToAPIDate, formatToDisplayDate } from '@/src/lib/date-utils'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { LuCalendar } from 'react-icons/lu'
import { type DateRange } from 'react-day-picker'
import * as z from 'zod'

// 기본값 상수
const DEFAULT_VALUES = {
  companyId: '',
  title: '',
  startDate: '',
  endDate: '',
  active: '',
} as const

import { cn } from '@/src/lib/class-utils'
import { Input } from '../../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select'

const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

interface NoticeSearchFormProps {
  searchForm: NoticeSearchForm
  updateSearchForm: (updates: Partial<NoticeSearchForm>) => void
  handleSearch: () => void
  loading: boolean
}

export default function NoticeSearchForm({
  searchForm,
  updateSearchForm,
  handleSearch,
  loading: searchLoading,
}: NoticeSearchFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // 기본값을 일관성 있게 처리하는 헬퍼 함수
  const getFormValues = useCallback(
    (searchForm: NoticeSearchForm): SearchFormData => ({
      companyId: searchForm.companyId ?? DEFAULT_VALUES.companyId,
      title: searchForm.title ?? DEFAULT_VALUES.title,
      startDate: searchForm.startDate ?? DEFAULT_VALUES.startDate,
      endDate: searchForm.endDate ?? DEFAULT_VALUES.endDate,
      active: searchForm.active ?? DEFAULT_VALUES.active,
    }),
    [],
  )

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: getFormValues(searchForm),
  })

  useEffect(() => {
    const formValues = getFormValues(searchForm)
    form.reset(formValues)

    // 날짜 범위 상태 동기화
    const newDateRange: DateRange | undefined =
      formValues.startDate || formValues.endDate
        ? {
            from: formValues.startDate
              ? (() => {
                  const date = new Date(formValues.startDate)
                  return isNaN(date.getTime()) ? undefined : date
                })()
              : undefined,
            to: formValues.endDate
              ? (() => {
                  const date = new Date(formValues.endDate)
                  return isNaN(date.getTime()) ? undefined : date
                })()
              : undefined,
          }
        : undefined

    setDateRange(newDateRange)
  }, [searchForm, form, getFormValues])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !searchLoading) {
        handleSearch()
      }
    },
    [handleSearch, searchLoading],
  )

  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range)

      const newStartDate = range?.from ? formatToAPIDate(range.from) : DEFAULT_VALUES.startDate
      const newEndDate = range?.to ? formatToAPIDate(range.to) : DEFAULT_VALUES.endDate

      form.setValue('startDate', newStartDate)
      form.setValue('endDate', newEndDate)

      updateSearchForm({
        startDate: newStartDate,
        endDate: newEndDate,
      })
    },
    [form, updateSearchForm],
  )

  const handleSubmit = useCallback(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <SearchActions onSearch={handleSubmit} loading={searchLoading}>
              <Button type="button" variant="outline" asChild>
                <Link href="/notices/create">등록</Link>
              </Button>
            </SearchActions>
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ companyId: value })
                    }}
                    loading={searchLoading}
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
                    onChange={(e) => {
                      field.onChange(e)
                      updateSearchForm({ title: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={searchLoading}
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
                    disabled={searchLoading}
                    aria-label="날짜 범위 선택"
                    aria-haspopup="dialog"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <LuCalendar className="h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {formatToDisplayDate(dateRange.from)} -{' '}
                          {formatToDisplayDate(dateRange.to)}
                        </>
                      ) : (
                        formatToDisplayDate(dateRange.from)
                      )
                    ) : (
                      <span>날짜를 선택해주세요</span>
                    )}
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ active: value })
                    }}
                    disabled={searchLoading}
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
