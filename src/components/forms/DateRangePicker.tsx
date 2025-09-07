'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { LuCalendar } from 'react-icons/lu'
import { type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/src/lib/class-utils'
import SearchField from './SearchField'

interface DateRangePickerProps {
  label: string
  startDate?: string
  endDate?: string
  onDateRangeChange: (startDate?: string, endDate?: string) => void
  loading: boolean
}

export default function DateRangePicker({
  label,
  startDate,
  endDate,
  onDateRangeChange,
  loading = false,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    if (startDate || endDate) {
      setDateRange({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      })
    }
  }, [startDate, endDate])

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)

    const newStartDate = range?.from ? format(range.from, 'yyyy-MM-dd') : undefined
    const newEndDate = range?.to ? format(range.to, 'yyyy-MM-dd') : undefined

    onDateRangeChange(newStartDate, newEndDate)
  }

  return (
    <SearchField label={label}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            disabled={loading}
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
    </SearchField>
  )
}
