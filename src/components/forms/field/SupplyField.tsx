'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Combobox } from '@/src/components/ui/Combobox'
import { useSuppliesQuery } from '@/src/hooks/product/useSupplyQueries'

interface SupplyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
}

function SupplyFieldInner<T extends FieldValues>({
  control,
  name,
  disabled: disabled = false,
  label = '공급사',
}: SupplyFieldProps<T>) {
  const { data: supplies = [], isLoading } = useSuppliesQuery()

  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Combobox
          width="w-full"
          options={supplies}
          valueKey="id"
          labelKey="name"
          value={(value as string) || 'all'}
          onValueChange={onChange}
          disabled={disabled || isLoading}
          allLabel="전체"
        />
      )}
    </FormFieldWrapper>
  )
}

const SupplyField = React.memo(SupplyFieldInner) as typeof SupplyFieldInner

export default SupplyField
