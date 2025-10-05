import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Textarea } from '@/src/components/ui/Textarea'

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  disabled: boolean
  rows: number
}

function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  rows = 15,
}: TextareaFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
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
