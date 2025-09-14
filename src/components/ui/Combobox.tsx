'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/src/lib/class-utils'
import { Button } from '@/src/components/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps<T = Record<string, unknown>> {
  options: T[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  width?: string
  className?: string
  disabled?: boolean
  valueKey: keyof T
  labelKey: keyof T
  disabledOptions?: string[]
}

export function Combobox<T = Record<string, unknown>>({
  options,
  value = '',
  onValueChange,
  // placeholder = '항목을 선택하세요...',
  placeholder,
  searchPlaceholder = '검색...',
  // emptyMessage = '항목을 찾을 수 없습니다.',
  emptyMessage = '-',
  // width = 'w-[200px]',
  className,
  disabled = false,
  valueKey,
  labelKey,
  disabledOptions = [],
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value)

  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const transformedOptions = React.useMemo(() => {
    const mappedOptions = options.map((option) => ({
      value: String(option[valueKey] ?? ''),
      label: String(option[labelKey] ?? ''),
      originalData: option,
    }))

    return [{ value: 'all', label: '전체', originalData: null }, ...mappedOptions]
  }, [options, valueKey, labelKey])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === internalValue ? '' : currentValue
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  const selectedOption = transformedOptions.find((option) => option.value === internalValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* <PopoverContent className={cn(width, 'p-0')}> */}
      <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {transformedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.value} ${option.label}`}
                  onSelect={() => handleSelect(option.value)}
                  disabled={disabledOptions.includes(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      internalValue === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
