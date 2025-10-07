'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import { Combobox } from '@/src/components/ui/Combobox'
import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { useSuppliesQuery } from '@/src/hooks/queries/useSupplyQueries'

interface SupplyComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

function SupplyCombobox({
  value,
  onValueChange,
  disabled = false,
}: SupplyComboboxProps) {
  const { data: supplies = [], isLoading } = useSuppliesQuery()

  return (
    <Combobox
      width="w-full"
      options={supplies}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
      allLabel="전체"
    />
  )
}

interface SupplyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
  onValueChange?: (value: string) => void
}

function SupplyFieldInner<T extends FieldValues>({
  control,
  name,
  disabled: disabled = false,
  label = '공급사',
  onValueChange: externalOnValueChange,
}: SupplyFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
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
