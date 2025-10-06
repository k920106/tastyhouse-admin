import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'

interface CompanyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  disabled: boolean
  onValueChange?: (value: string) => void
}

function CompanyFieldInner<T extends FieldValues>({
  control,
  name,
  label = '매체사',
  disabled: disabled = false,
  onValueChange: externalOnValueChange,
}: CompanyFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => {
        const handleChange = (newValue: string) => {
          onChange(newValue)
          externalOnValueChange?.(newValue)
        }
        return (
          <CompanyCombobox
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
          />
        )
      }}
    </FormFieldWrapper>
  )
}

const CompanyField = React.memo(CompanyFieldInner) as typeof CompanyFieldInner

export default CompanyField
