import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import SwitchField from '@/src/components/forms/field/SwitchField'

interface ActiveStatusSwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  disabled: boolean
}

function ActiveStatusSwitchFieldInner<T extends FieldValues>({
  control,
  name,
  label = '활성상태',
  disabled = false,
}: ActiveStatusSwitchFieldProps<T>) {
  return <SwitchField control={control} name={name} disabled={disabled} label={label} />
}

const ActiveStatusSwitchField = React.memo(
  ActiveStatusSwitchFieldInner,
) as typeof ActiveStatusSwitchFieldInner

export default ActiveStatusSwitchField
