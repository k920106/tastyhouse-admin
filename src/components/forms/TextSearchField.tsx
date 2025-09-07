'use client'

import { Input } from '@/src/components/ui/Input'
import SearchField from './SearchField'

interface TextSearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onSearch?: () => void
  loading: boolean
  placeholder?: string
  className?: string
}

export default function TextSearchField({
  label,
  value,
  onChange,
  onSearch,
  loading = false,
  placeholder,
  className,
}: TextSearchFieldProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && onSearch) {
      onSearch()
    }
  }

  return (
    <SearchField label={label} className={className}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
      />
    </SearchField>
  )
}
