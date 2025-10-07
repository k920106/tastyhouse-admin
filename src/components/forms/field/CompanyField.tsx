import React, { useCallback } from 'react'
import { Control, FieldValues, Path, useFormContext } from 'react-hook-form'

import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'

interface Company {
  id: number
  name: string
}

interface CompanyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  syncCompanyName?: boolean
  label: string
}

function CompanyFieldInner<T extends FieldValues>({
  control,
  name,
  disabled: disabled = false,
  syncCompanyName = false,
  label = '매체사',
}: CompanyFieldProps<T>) {
  const form = useFormContext<T>()

  const handleCompanySelect = useCallback(
    (company: Company | null) => {
      if (syncCompanyName && form && company) {
        form.setValue('companyName' as Path<T>, company.name as never)
      }
    },
    [syncCompanyName, form],
  )

  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <CompanyCombobox
          value={value as string}
          onValueChange={onChange}
          onCompanySelect={handleCompanySelect}
          disabled={disabled}
        />
      )}
    </FormFieldWrapper>
  )
}

const CompanyField = React.memo(CompanyFieldInner) as typeof CompanyFieldInner

export default CompanyField
