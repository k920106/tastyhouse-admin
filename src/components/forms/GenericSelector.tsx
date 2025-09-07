'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import SearchField from './SearchField'

interface GenericOption {
  id: string | number
  name: string
}

interface GenericSelectorProps {
  label: string
  value: string | undefined
  options: GenericOption[]
  onValueChange: (value: string) => void
  loading: boolean
}

export default function GenericSelector({
  label,
  options,
  loading,
  value,
  onValueChange,
}: GenericSelectorProps) {
  return (
    <SearchField label={label}>
      <Combobox
        options={options}
        valueKey="id"
        labelKey="name"
        value={value || 'all'}
        onValueChange={onValueChange}
        disabled={loading}
      />
    </SearchField>
  )
}
