import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Textarea } from '@/src/components/ui/Textarea'

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
  rows: number
}

function TextareaField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  label,
  rows = 15,
}: TextareaFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Textarea
          id={name}
          value={value as string}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
        />
      )}
    </FormFieldWrapper>
  )
}

export default TextareaField
