'use client'

import { Input } from '@/src/components/ui/Input'
import SearchField from './SearchField'

interface TextSearchFieldProps {
  label: string
  value: string
  onSearch: () => void
  onChange: (value: string) => void
  loading: boolean
}

export default function TextSearchField({
  label,
  value,
  onSearch,
  onChange,
  loading = false,
}: TextSearchFieldProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && onSearch) {
      onSearch()
    }
  }

  return (
    <SearchField label={label}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
    </SearchField>
  )
}
