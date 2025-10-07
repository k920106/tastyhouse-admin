'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Combobox } from '@/src/components/ui/Combobox'
import { useBrandsQuery } from '@/src/hooks/queries/useBrandQueries'

interface BrandFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
}

function BrandFieldInner<T extends FieldValues>({
  control,
  name,
  disabled: disabled = false,
  label = '교환처',
}: BrandFieldProps<T>) {
  const { data: brands = [], isLoading } = useBrandsQuery()

  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Combobox
          width="w-full"
          options={brands}
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

const BrandField = React.memo(BrandFieldInner) as typeof BrandFieldInner

export default BrandField
