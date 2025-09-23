'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { formatToAPIDate } from '@/src/lib/date-utils'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { type NoticeSearchForm, getNoticeUseStatusLabel } from '@/src/types/notice'

const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
}) satisfies z.ZodType<NoticeSearchForm>

export default function NoticeFilters() {
  const { urlSearchForm, isLoading, updateUrl } = useNoticeSearchWithQuery()
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)

  // 임시 입력값 상태 (검색 버튼 클릭 전까지만 유지)
  const [searchForm, setSearchForm] = useState<NoticeSearchForm>(urlSearchForm)

  // URL 상태가 변경되면 임시 폼도 동기화
  useEffect(() => {
    setSearchForm(urlSearchForm)
  }, [urlSearchForm])

  // 기본값을 일관성 있게 처리하는 헬퍼 함수 - 타입 안정성 향상
  const getFormValues = useCallback(
    (searchForm: NoticeSearchForm): NoticeSearchForm => ({
      companyId: searchForm.companyId ?? '',
      title: searchForm.title ?? '',
      startDate: searchForm.startDate ?? '',
      endDate: searchForm.endDate ?? '',
      active: searchForm.active ?? '',
    }),
    [],
  )

  // 폼 값 메모이제이션으로 성능 최적화
  const formValues = useMemo(() => getFormValues(searchForm), [searchForm, getFormValues])

  // React Hook Form 설정
  const form = useForm<NoticeSearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: formValues,
  })

  // 폼 리셋 로직 최적화
  useEffect(() => {
    form.reset(formValues)
  }, [form, formValues])

  // 디바운싱을 위한 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 안전한 폼 업데이트 헬퍼 함수
  const safeUpdateForm = useCallback(
    (prev: NoticeSearchForm, updates: Partial<NoticeSearchForm>): NoticeSearchForm => {
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined),
      )

      return {
        companyId: filteredUpdates.companyId ?? prev.companyId,
        title: filteredUpdates.title ?? prev.title,
        startDate: filteredUpdates.startDate ?? prev.startDate,
        endDate: filteredUpdates.endDate ?? prev.endDate,
        active: filteredUpdates.active ?? prev.active,
      }
    },
    [],
  )

  // 디바운싱된 검색 폼 업데이트 (title 필드용)
  const updateSearchFormDebounced = useCallback(
    (updates: Partial<NoticeSearchForm>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        setSearchForm((prev) => safeUpdateForm(prev, updates))
      }, 300)
    },
    [safeUpdateForm],
  )

  // 즉시 검색 폼 업데이트 (select, date 필드용)
  const updateSearchForm = useCallback(
    (updates: Partial<NoticeSearchForm>) => {
      setSearchForm((prev) => safeUpdateForm(prev, updates))
    },
    [safeUpdateForm],
  )

  // 날짜 변환 로직 분리 - 성능 최적화
  const parseDateSafely = useCallback((dateString: string) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? undefined : date
  }, [])

  // 날짜 범위 생성 유틸 함수 - 복잡도 감소
  const createDateRange = useCallback(
    (startDate: string, endDate: string): DateRange | undefined => {
      const to = parseDateSafely(endDate)
      const from = parseDateSafely(startDate)
      return from || to ? { from, to } : undefined
    },
    [parseDateSafely],
  )

  // 날짜 범위 메모이제이션 - 단순화된 로직
  const dateRange = useMemo(
    () => createDateRange(formValues.startDate, formValues.endDate),
    [formValues.startDate, formValues.endDate, createDateRange],
  )

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
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
    const validation = validateNoticeSearchForm(searchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 0으로 리셋)
    updateUrl(searchForm, 0)
  }, [searchForm, updateUrl])

  // 폼 제출 핸들러
  const handleSubmit = useCallback(() => {
    handleSearch()
  }, [handleSearch])

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
                      updateSearchFormDebounced({ title: e.target.value })
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="font-semibold">등록일자</FormLabel>
            <FormControl>
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    disabled={isLoading}
                    aria-label={dateRange?.from ? '선택된 날짜 범위 수정' : '날짜 범위 선택'}
                    aria-describedby="date-range-description"
                    aria-haspopup="dialog"
                    aria-expanded={isDatePopoverOpen}
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
