'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import SearchField from './SearchField'
import { useSuppliesQuery } from '@/src/hooks/queries/useSupplyQueries'

interface SupplySelectorProps {
  label?: string
  value: string | undefined
  onValueChange: (value: string) => void
  disabledOptions?: string[]
  loading: boolean
}

export default function SupplySelector({
  label = '공급사',
  value,
  onValueChange,
  disabledOptions,
  loading = false,
}: SupplySelectorProps) {
  const { data: supplies = [], isLoading } = useSuppliesQuery()

  return (
    <SearchField label={label}>
      <Combobox
        options={supplies}
        valueKey="id"
        labelKey="name"
        value={value || 'all'}
        onValueChange={onValueChange}
        disabled={loading || isLoading}
        disabledOptions={disabledOptions}
      />
    </SearchField>
  )
}
