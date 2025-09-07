'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import SearchField from './SearchField'

interface StatusSelectorProps {
  label: string
  value: string | undefined
  getLabel: (status: boolean) => string
  onValueChange: (value: string) => void
  loading: boolean
}

export default function StatusSelector({
  label,
  value,
  getLabel,
  onValueChange,
  loading,
}: StatusSelectorProps) {
  return (
    <SearchField label={label}>
      <Select
        value={value || 'all'}
        defaultValue="all"
        onValueChange={onValueChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="true">{getLabel(true)}</SelectItem>
          <SelectItem value="false">{getLabel(false)}</SelectItem>
        </SelectContent>
      </Select>
    </SearchField>
  )
}
