import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Switch } from '@/src/components/ui/Switch'

interface ActiveStatusSwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  disabled?: boolean
}

function ActiveStatusSwitchFieldInner<T extends FieldValues>({
  control,
  name,
  label = '활성 여부',
  disabled = false,
}: ActiveStatusSwitchFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Switch
          checked={value === 'true'}
          onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')}
          disabled={disabled}
        />
      )}
    </FormFieldWrapper>
  )
}

const ActiveStatusSwitchField = React.memo(
  ActiveStatusSwitchFieldInner,
) as typeof ActiveStatusSwitchFieldInner

export default ActiveStatusSwitchField
