import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Input } from '@/src/components/ui/Input'

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  isLoading?: boolean
  placeholder?: string
}

function TextField<T extends FieldValues>({
  name,
  label,
  control,
  isLoading = false,
  placeholder,
}: TextFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Input
          type="text"
          value={value as string}
          onChange={onChange}
          disabled={isLoading}
          placeholder={placeholder}
        />
      )}
    </FormFieldWrapper>
  )
}

export default TextField
