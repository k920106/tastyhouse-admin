import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Textarea } from '@/src/components/ui/Textarea'

interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  isLoading?: boolean
  placeholder?: string
  rows?: number
}

function TextareaField<T extends FieldValues>({
  name,
  label,
  control,
  isLoading = false,
  placeholder,
  rows = 15,
}: TextareaFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Textarea
          id={name}
          value={value as string}
          onChange={onChange}
          disabled={isLoading}
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </FormFieldWrapper>
  )
}

export default TextareaField
