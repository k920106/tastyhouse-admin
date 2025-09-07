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
  onValueChange: (value: string) => void
  getLabel: (status: boolean) => string
  loading: boolean
}

export default function StatusSelector({
  label,
  value,
  onValueChange,
  getLabel,
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
