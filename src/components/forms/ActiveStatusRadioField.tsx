import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import RadioField, { RadioOption } from '@/src/components/forms/RadioField'
import { ACTIVE_STATUS } from '@/src/types/common'

interface ActiveStatusRadioFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
}

const ACTIVE_STATUS_OPTIONS: RadioOption[] = [
  {
    value: ACTIVE_STATUS.ACTIVE.value,
    label: ACTIVE_STATUS.ACTIVE.label,
    id: 'use',
  },
  {
    value: ACTIVE_STATUS.NOT_ACTIVE.value,
    label: ACTIVE_STATUS.NOT_ACTIVE.label,
    id: 'not-use',
  },
]

function ActiveStatusRadioFieldInner<T extends FieldValues>({
  control,
  name,
  label = '활성 여부',
}: ActiveStatusRadioFieldProps<T>) {
  return <RadioField control={control} name={name} label={label} options={ACTIVE_STATUS_OPTIONS} />
}

const ActiveStatusRadioField = React.memo(
  ActiveStatusRadioFieldInner,
) as typeof ActiveStatusRadioFieldInner

export default ActiveStatusRadioField
