'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useSuppliesQuery } from '@/src/hooks/queries/useSupplyQueries'

interface SupplySelectorProps {
  value: string | undefined
  onValueChange: (value: string) => void
  loading: boolean
}

export default function SupplySelector({
  value,
  onValueChange,
  loading = false,
}: SupplySelectorProps) {
  const { data: supplies = [], isLoading } = useSuppliesQuery()

  return (
    <Combobox
      options={supplies}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={onValueChange}
      disabled={loading || isLoading}
    />
  )
}
