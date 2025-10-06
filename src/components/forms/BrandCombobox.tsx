'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useBrandsQuery } from '@/src/hooks/queries/useBrandQueries'

interface BrandComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

export default function BrandCombobox({
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
