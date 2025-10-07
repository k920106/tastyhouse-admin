import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { ActiveFilter, getActiveStatusLabel } from '@/src/types/common'

interface ActiveStatusSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
}

function ActiveStatusSelectFilterInner<T extends FieldValues>({
  control,
  name,
  disabled = false,
  label = '활성상태',
}: ActiveStatusSelectProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
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

const ActiveStatusSelectField = React.memo(
  ActiveStatusSelectFilterInner,
) as typeof ActiveStatusSelectFilterInner

export default ActiveStatusSelectField
