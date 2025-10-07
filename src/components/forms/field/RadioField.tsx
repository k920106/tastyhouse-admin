import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { FormControl, FormItem, FormLabel } from '../../ui/Form'
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup'

export interface RadioOption {
  value: string
  label: string
  id: string
}

interface RadioFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  options: RadioOption[]
  label: string
}

function RadioFieldInner<T extends FieldValues>({
  control,
  name,
  options,
  label = '',
}: RadioFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <RadioGroup
          onValueChange={onChange}
          defaultValue={value as string}
          className="flex flex-col"
        >
          {options.map((option) => (
            <FormItem key={option.value} className="flex items-center gap-3 space-y-0">
              <FormControl>
                <RadioGroupItem id={option.id} value={option.value} />
              </FormControl>
              <FormLabel className="font-normal" htmlFor={option.id}>
                {option.label}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )}
    </FormFieldWrapper>
  )
}

const RadioField = React.memo(RadioFieldInner) as typeof RadioFieldInner

export default RadioField
