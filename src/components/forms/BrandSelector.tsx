'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import SearchField from './SearchField'
import { useBrandsQuery } from '@/src/hooks/queries/useBrandQueries'

interface BrandSelectorProps {
  label: string
  value: string | undefined
  onValueChange: (value: string) => void
  loading: boolean
}

export default function BrandSelector({
  label = '교환처',
  value,
  onValueChange,
  loading = false,
}: BrandSelectorProps) {
  const { data: brands = [], isLoading } = useBrandsQuery()

  return (
    <SearchField label={label}>
      <Combobox
        options={brands}
        valueKey="id"
        labelKey="name"
        value={value || 'all'}
        onValueChange={onValueChange}
        disabled={loading || isLoading}
      />
    </SearchField>
  )
}
