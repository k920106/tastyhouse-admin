'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Combobox } from '@/src/components/ui/Combobox'
import { useBrandsQuery } from '@/src/hooks/queries/useBrandQueries'

interface BrandComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

function BrandCombobox({
  value,
  onValueChange,
  disabled = false,
}: BrandComboboxProps) {
  const { data: brands = [], isLoading } = useBrandsQuery()

  return (
    <Combobox
      width="w-full"
      options={brands}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
      allLabel="전체"
    />
  )
}

interface BrandFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
  onValueChange?: (value: string) => void
}

function BrandFieldInner<T extends FieldValues>({
  control,
  name,
  disabled: disabled = false,
  label = '교환처',
  onValueChange: externalOnValueChange,
}: BrandFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => {
        const handleChange = (newValue: string) => {
          onChange(newValue)
          externalOnValueChange?.(newValue)
        }
        return (
          <BrandCombobox value={value as string} onValueChange={handleChange} disabled={disabled} />
        )
      }}
    </FormFieldWrapper>
  )
}

const BrandField = React.memo(BrandFieldInner) as typeof BrandFieldInner

export default BrandField
