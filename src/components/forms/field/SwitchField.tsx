import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Switch } from '@/src/components/ui/Switch'

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
}

function SwitchFieldInner<T extends FieldValues>({
  control,
  name,
  disabled = false,
  label = '',
}: SwitchFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Switch checked={value as boolean} onCheckedChange={onChange} disabled={disabled} />
      )}
    </FormFieldWrapper>
  )
}

const SwitchField = React.memo(SwitchFieldInner) as typeof SwitchFieldInner

export default SwitchField
