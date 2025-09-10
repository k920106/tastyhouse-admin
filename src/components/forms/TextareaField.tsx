'use client'

import { Textarea } from '@/src/components/ui/Textarea'
import SearchField from './SearchField'

interface TextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  disabled?: boolean
  placeholder?: string
  id?: string
}

export default function TextareaField({
  label,
  value,
  onChange,
  rows = 5,
  disabled = false,
  placeholder,
  id,
}: TextareaFieldProps) {
  const fieldId = id || `${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <SearchField label={label}>
      <Textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
      />
    </SearchField>
  )
}
