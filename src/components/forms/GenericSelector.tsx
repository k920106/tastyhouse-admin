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
  onValueChange: (value: string) => void
  options: GenericOption[]
  disabledOptions?: string[]
  loading: boolean
}

export default function GenericSelector({
  label,
  options,
  loading,
  value,
  onValueChange,
  disabledOptions,
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
        disabledOptions={disabledOptions}
      />
    </SearchField>
  )
}
