'use client'

import React, { useCallback } from 'react'
import { Control, FieldValues, Path, useFormContext } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Combobox } from '@/src/components/ui/Combobox'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'

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
  const { data: companies = [], isLoading } = useCompaniesQuery()

  const handleCompanySelect = useCallback(
    (company: Company | null) => {
      if (syncCompanyName && form && company) {
        form.setValue('companyName' as Path<T>, company.name as never)
      }
    },
    [syncCompanyName, form],
  )

  const handleValueChange = useCallback(
    (newValue: string, onChange: (value: string) => void) => {
      onChange(newValue)

      const selectedCompany = companies.find((c) => c.id.toString() === newValue)
      handleCompanySelect(selectedCompany || null)
    },
    [companies, handleCompanySelect],
  )

  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Combobox
          width="w-full"
          options={companies}
          valueKey="id"
          labelKey="name"
          value={(value as string) || 'all'}
          onValueChange={(newValue) => handleValueChange(newValue, onChange)}
          disabled={disabled || isLoading}
          disabledOptions={['all']}
          allLabel="-"
        />
      )}
    </FormFieldWrapper>
  )
}

const CompanyField = React.memo(CompanyFieldInner) as typeof CompanyFieldInner

export default CompanyField
