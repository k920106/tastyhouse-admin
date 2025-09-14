'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useBrandsQuery } from '@/src/hooks/queries/useBrandQueries'

interface BrandSelectorProps {
  value: string | undefined
  onValueChange: (value: string) => void
  loading: boolean
}

export default function BrandSelector({
  value,
  onValueChange,
  loading = false,
}: BrandSelectorProps) {
  const { data: brands = [], isLoading } = useBrandsQuery()

  return (
    <Combobox
      options={brands}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={onValueChange}
      disabled={loading || isLoading}
    />
  )
}
