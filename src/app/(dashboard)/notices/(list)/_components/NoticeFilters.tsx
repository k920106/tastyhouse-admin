'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { type NoticeSearchForm, getNoticeUseStatusLabel } from '@/src/types/notice'
import { useNoticeSearchWithQuery } from '@/src/hooks/useNoticeSearchWithQuery'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatToAPIDate, formatToDisplayDate } from '@/src/lib/date-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import { INITIAL_NOTICE_SEARCH_FORM } from '@/src/constants/notice'
import { toast } from 'sonner'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { LuCalendar } from 'react-icons/lu'
import { type DateRange } from 'react-day-picker'
import * as z from 'zod'

import { cn } from '@/src/lib/class-utils'
import { Input } from '@/src/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { Loader2Icon } from 'lucide-react'

const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

export default function NoticeFilters() {
  const { updateUrl, isLoading } = useNoticeSearchWithQuery()

  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 로컬 검색 폼 상태 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [localSearchForm, setLocalSearchForm] = useState<NoticeSearchForm>(initialSearchForm)

  // 기본값을 일관성 있게 처리하는 헬퍼 함수
  const getFormValues = useCallback(
    (searchForm: NoticeSearchForm): SearchFormData => ({
      companyId: searchForm.companyId ?? '',
      title: searchForm.title ?? '',
      startDate: searchForm.startDate ?? '',
      endDate: searchForm.endDate ?? '',
      active: searchForm.active ?? '',
    }),
    [],
  )

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: getFormValues(localSearchForm),
  })

  useEffect(() => {
    const formValues = getFormValues(localSearchForm)
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
  }, [localSearchForm, form, getFormValues])

  // 검색 폼 업데이트
  const updateSearchForm = useCallback((updates: Partial<NoticeSearchForm>) => {
    setLocalSearchForm(
      (prev) =>
        ({
          ...prev,
          ...Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined)),
        }) as NoticeSearchForm,
    )
  }, [])

  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range)

      const newStartDate = range?.from ? formatToAPIDate(range.from) : ''
      const newEndDate = range?.to ? formatToAPIDate(range.to) : ''

      form.setValue('startDate', newStartDate)
      form.setValue('endDate', newEndDate)

      updateSearchForm({
        startDate: newStartDate,
        endDate: newEndDate,
      })
    },
    [form, updateSearchForm],
  )

  // 검색 실행
  const handleSearch = useCallback(() => {
    const validation = validateNoticeSearchForm(localSearchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 0으로 리셋)
    updateUrl(localSearchForm, 0)
  }, [localSearchForm, updateUrl])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch],
  )

  const handleSubmit = useCallback(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <>
              <Button type="button" variant="outline" asChild>
                <Link href="/notices/create">등록</Link>
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Loader2Icon className="animate-spin" /> : '조회'}
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ companyId: value })
                    }}
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
                    onChange={(e) => {
                      field.onChange(e)
                      updateSearchForm({ title: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
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
