import { useMemo } from 'react'
import { type DateRange } from 'react-day-picker'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { LuCalendar } from 'react-icons/lu'

import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { FormControl, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { cn } from '@/src/lib/class-utils'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { formatToAPIDate } from '@/src/lib/date-utils'
import { NoticeSearchForm } from '@/src/types/notice'

interface DateRangeFieldProps {
  watch: UseFormWatch<NoticeSearchForm>
  setValue: UseFormSetValue<NoticeSearchForm>
  isLoading: boolean
}

export default function DateRangeField({
  watch,
  setValue,
  isLoading = false,
}: DateRangeFieldProps) {
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const dateRange: DateRange | undefined = useMemo(() => {
    const fromDate = startDate ? new Date(startDate) : undefined
    const toDate = endDate ? new Date(endDate) : undefined
    const validFrom = fromDate && !isNaN(fromDate.getTime()) ? fromDate : undefined
    const validTo = toDate && !isNaN(toDate.getTime()) ? toDate : undefined
    return validFrom || validTo ? { from: validFrom, to: validTo } : undefined
  }, [startDate, endDate])

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    const newStartDate = range?.from ? formatToAPIDate(range.from) : ''
    const newEndDate = range?.to ? formatToAPIDate(range.to) : ''

    setValue('startDate', newStartDate)
    setValue('endDate', newEndDate)
  }

  return (
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
  )
}
