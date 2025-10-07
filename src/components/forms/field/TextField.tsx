import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Input } from '@/src/components/ui/Input'

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label?: string
}

function TextField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  label = '',
}: TextFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Input type="text" value={value as string} onChange={onChange} disabled={disabled} />
      )}
    </FormFieldWrapper>
  )
}

export default TextField
