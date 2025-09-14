'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import SearchActions from '@/src/components/forms/SearchActions'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { NoticeSearchForm, getNoticeUseStatusLabel } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { LuCalendar } from 'react-icons/lu'
import { type DateRange } from 'react-day-picker'
import * as z from 'zod'
import { cn } from '@/src/lib/class-utils'
import { Input } from '../../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select'

const searchFormSchema = z.object({
  companyId: z.string().optional(),
  title: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.string().optional(),
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
  // 페이징 API Response 응답 스펙 바뀜
  // 그래서 지금 페이징처리 안됨
  // Notice ReactHook Form 적용한 것 처럼 Products도 수정해야 함

  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      companyId: searchForm.companyId || '',
      title: searchForm.title || '',
      startDate: searchForm.startDate || '',
      endDate: searchForm.endDate || '',
      active: searchForm.active || '',
    },
  })

  // 상위 컴포넌트의 searchForm 상태와 동기화
  useEffect(() => {
    form.reset({
      companyId: searchForm.companyId || '',
      title: searchForm.title || '',
      startDate: searchForm.startDate || '',
      endDate: searchForm.endDate || '',
      active: searchForm.active || '',
    })

    // 날짜 범위 상태도 동기화
    if (searchForm.startDate || searchForm.endDate) {
      setDateRange({
        from: searchForm.startDate ? new Date(searchForm.startDate) : undefined,
        to: searchForm.endDate ? new Date(searchForm.endDate) : undefined,
      })
    }
  }, [searchForm, form])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearch()
    }
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)

    const newStartDate = range?.from ? format(range.from, 'yyyy-MM-dd') : ''
    const newEndDate = range?.to ? format(range.to, 'yyyy-MM-dd') : ''

    form.setValue('startDate', newStartDate)
    form.setValue('endDate', newEndDate)
    updateSearchForm({
      startDate: newStartDate,
      endDate: newEndDate,
    })
  }

  const handleSubmit = () => {
    handleSearch()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <SearchActions onSearch={form.handleSubmit(handleSubmit)} loading={searchLoading}>
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
                    value={field.value || ''}
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
                    value={field.value || ''}
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
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <LuCalendar className="h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'yyyy.MM.dd', { locale: ko })} -{' '}
                          {format(dateRange.to, 'yyyy.MM.dd', { locale: ko })}
                        </>
                      ) : (
                        format(dateRange.from, 'yyyy.MM.dd', { locale: ko })
                      )
                    ) : (
                      <span></span>
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
                    locale={ko}
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
                    value={field.value || ''}
                    defaultValue="all"
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

/*
  React Hook Form을 사용한 NoticeSearchForm 구현:

  주요 변경사항:
  1. useForm 훅을 사용하여 폼 상태 관리
  2. zod를 통한 스키마 검증
  3. Form, FormField, FormItem, FormLabel, FormControl 컴포넌트 활용
  4. handleDateRangeChange에서 form.setValue를 통한 날짜 값 업데이트
  5. props 인터페이스 변경: onSearch 콜백으로 데이터 전달

  기존 설계 원칙은 유지:
  - DateRangePicker는 범용 컴포넌트로 재사용성 보장
  - 관심사 분리: UI 컴포넌트와 상태 관리 로직 분리
  - 각 폼 컴포넌트에서 고유한 상태 업데이트 로직 구현
 */
