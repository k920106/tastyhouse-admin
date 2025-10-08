'use client'

import React, { useCallback, useMemo } from 'react'
import { type DateRange } from 'react-day-picker'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { LuCalendar } from 'react-icons/lu'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { cn } from '@/src/lib/class-utils'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { formatToAPIDate } from '@/src/lib/date-utils'

interface DateRangeFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label?: string
}

function DateRangeFieldInner<T extends FieldValues>({
  control,
  name,
  disabled,
  label = '',
}: DateRangeFieldProps<T>) {
  const {
    field: { value: startDate, onChange: onStartDateChange },
  } = useController({
    name: 'startDate' as Path<T>,
    control,
  })

  const {
    field: { value: endDate, onChange: onEndDateChange },
  } = useController({
    name: 'endDate' as Path<T>,
    control,
  })

  const dateRange: DateRange | undefined = useMemo(() => {
    const fromDate = startDate ? new Date(startDate) : undefined
    const toDate = endDate ? new Date(endDate) : undefined
    const validFrom = fromDate && !isNaN(fromDate.getTime()) ? fromDate : undefined
    const validTo = toDate && !isNaN(toDate.getTime()) ? toDate : undefined
    return validFrom || validTo ? { from: validFrom, to: validTo } : undefined
  }, [startDate, endDate])

  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      const newStartDate = range?.from ? formatToAPIDate(range.from) : ''
      const newEndDate = range?.to ? formatToAPIDate(range.to) : ''

      onStartDateChange(newStartDate)
      onEndDateChange(newEndDate)
    },
    [onStartDateChange, onEndDateChange],
  )

  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {() => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              disabled={disabled}
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
      )}
    </FormFieldWrapper>
  )
}

const DateRangeField = React.memo(DateRangeFieldInner) as typeof DateRangeFieldInner

export default DateRangeField
