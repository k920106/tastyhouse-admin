'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useSuppliesQuery } from '@/src/hooks/queries/useSupplyQueries'

interface SupplyComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

export default function SupplyCombobox({
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
