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
import { NoticeSearchFormInput } from '@/src/types/notice'

interface DateRangeFieldProps {
  watch: UseFormWatch<NoticeSearchFormInput>
  setValue: UseFormSetValue<NoticeSearchFormInput>
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
            />
          </PopoverContent>
        </Popover>
      </FormControl>
    </FormItem>
  )
}
