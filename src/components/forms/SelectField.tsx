import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  options: SelectOption[]
  disabled: boolean
}

function SelectFieldInner<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled = false,
}: SelectFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Select value={(value as string) ?? 'all'} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormFieldWrapper>
  )
}

const SelectField = React.memo(SelectFieldInner) as typeof SelectFieldInner

export default SelectField
