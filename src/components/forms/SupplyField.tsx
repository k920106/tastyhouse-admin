import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import SupplyCombobox from '@/src/components/forms/SupplyCombobox'

interface SupplyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  disabled: boolean
  onValueChange?: (value: string) => void
}

function SupplyFieldInner<T extends FieldValues>({
  control,
  name,
  label = '공급사',
  disabled: disabled = false,
  onValueChange: externalOnValueChange,
}: SupplyFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => {
        const handleChange = (newValue: string) => {
          onChange(newValue)
          externalOnValueChange?.(newValue)
        }
        return (
          <SupplyCombobox
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
          />
        )
      }}
    </FormFieldWrapper>
  )
}

const SupplyField = React.memo(SupplyFieldInner) as typeof SupplyFieldInner

export default SupplyField
