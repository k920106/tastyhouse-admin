'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { Input } from '@/src/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { Loader2Icon } from 'lucide-react'
import { LuCalendar } from 'react-icons/lu'
import Link from 'next/link'

import { getNoticeUseStatusLabel } from '@/src/types/notice'
import { useNoticeFilters } from '@/src/hooks/useNoticeFilters'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { cn } from '@/src/lib/class-utils'

export default function NoticeFilters() {
  const {
    form,
    dateRange,
    handleDateRangeSelect,
    handleSubmit,
    handleKeyDown,
    updateSearchForm,
    isLoading,
  } = useNoticeFilters()

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
