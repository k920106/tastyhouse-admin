'use client'

import { Label } from '@/src/components/ui/Label'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup'
import SearchField from './SearchField'

interface BooleanRadioGroupProps {
  label: string
  trueLabel: string
  falseLabel: string
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export default function BooleanRadioGroup({
  label,
  trueLabel,
  falseLabel,
  value,
  onChange,
  disabled = false,
}: BooleanRadioGroupProps) {
  const trueId = `${label.replace(/\s+/g, '-').toLowerCase()}-true`
  const falseId = `${label.replace(/\s+/g, '-').toLowerCase()}-false`

  return (
    <SearchField label={label}>
      <RadioGroup
        value={value.toString()}
        onValueChange={(stringValue) => onChange(stringValue === 'true')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id={trueId} disabled={disabled} />
          <Label htmlFor={trueId}>{trueLabel}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id={falseId} disabled={disabled} />
          <Label htmlFor={falseId}>{falseLabel}</Label>
        </div>
      </RadioGroup>
    </SearchField>
  )
}
