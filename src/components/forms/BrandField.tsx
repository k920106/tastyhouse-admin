import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import BrandCombobox from '@/src/components/forms/BrandCombobox'
import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'

interface BrandFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  disabled: boolean
  onValueChange?: (value: string) => void
}

function BrandFieldInner<T extends FieldValues>({
  control,
  name,
  label = '교환처',
  disabled: disabled = false,
  onValueChange: externalOnValueChange,
}: BrandFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => {
        const handleChange = (newValue: string) => {
          onChange(newValue)
          externalOnValueChange?.(newValue)
        }
        return (
          <BrandCombobox
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
          />
        )
      }}
    </FormFieldWrapper>
  )
}

const BrandField = React.memo(BrandFieldInner) as typeof BrandFieldInner

export default BrandField
