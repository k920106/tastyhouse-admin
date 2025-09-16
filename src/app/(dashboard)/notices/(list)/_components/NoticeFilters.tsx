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

// Zod 스키마와 타입 통합 - 타입 안정성 향상
const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
}) satisfies z.ZodType<NoticeSearchForm>

export default function NoticeFilters() {
  const { updateUrl, isLoading } = useNoticeSearchWithQuery()

  const searchParams = useSearchParams()

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 로컬 검색 폼 상태 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [localSearchForm, setLocalSearchForm] = useState<NoticeSearchForm>(initialSearchForm)

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
  const formValues = useMemo(() => getFormValues(localSearchForm), [localSearchForm, getFormValues])

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

  // 날짜 범위 표시 텍스트 생성 유틸 함수 - 가독성 향상
  const formatDateRangeDisplay = useCallback((range: DateRange | undefined): string => {
    if (!range?.from) return '날짜를 선택해주세요'
    if (!range.to) return formatToDisplayDate(range.from)
    return `${formatToDisplayDate(range.from)} - ${formatToDisplayDate(range.to)}`
  }, [])

  // 날짜 범위 메모이제이션 - 단순화된 로직
  const dateRange = useMemo(
    () => createDateRange(formValues.startDate, formValues.endDate),
    [formValues.startDate, formValues.endDate, createDateRange],
  )

  const form = useForm<NoticeSearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: formValues,
  })

  // 폼 리셋 로직 최적화
  useEffect(() => {
    form.reset(formValues)
  }, [form, formValues])

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
