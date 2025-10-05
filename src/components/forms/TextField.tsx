import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Input } from '@/src/components/ui/Input'

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  disabled: boolean
}

function TextField<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: TextFieldProps<T>) {
  return (
    <FormFieldWrapper name={name} label={label} control={control}>
      {({ value, onChange }) => (
        <Input type="text" value={value as string} onChange={onChange} disabled={disabled} />
      )}
    </FormFieldWrapper>
  )
}

export default TextField
