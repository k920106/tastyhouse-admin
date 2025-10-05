import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'

interface CompanyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  isLoading?: boolean
}

function CompanyFieldInner<T extends FieldValues>({
  control,
  name,
  label = '매체사',
  isLoading = false,
}: CompanyFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <CompanyCombobox value={value as string} onValueChange={onChange} loading={isLoading} />
      )}
    </FormFieldWrapper>
  )
}

const CompanyField = React.memo(CompanyFieldInner) as typeof CompanyFieldInner

export default CompanyField
