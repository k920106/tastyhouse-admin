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
import { getActiveStatusLabel } from '@/src/types/common'

type ActiveFilter = 'all' | 'true' | 'false'

interface ActiveStatusSelectFilterProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  disabled: boolean
}

function ActiveStatusSelectFilterInner<T extends FieldValues>({
  control,
  name,
  label = '활성상태',
  disabled = false,
}: ActiveStatusSelectFilterProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Select
          value={(value as ActiveFilter) ?? 'all'}
          onValueChange={(value: ActiveFilter) => onChange(value)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="true">{getActiveStatusLabel(true)}</SelectItem>
            <SelectItem value="false">{getActiveStatusLabel(false)}</SelectItem>
          </SelectContent>
        </Select>
      )}
    </FormFieldWrapper>
  )
}

const ActiveStatusSelectFilter = React.memo(
  ActiveStatusSelectFilterInner,
) as typeof ActiveStatusSelectFilterInner

export default ActiveStatusSelectFilter
