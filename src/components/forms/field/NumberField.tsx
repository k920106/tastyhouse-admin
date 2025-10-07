import { Control, FieldValues, Path } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/field/FormFieldWrapper'
import { Input } from '@/src/components/ui/Input'

interface NumberFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  disabled: boolean
  label: string
}

function NumberField<T extends FieldValues>({
  control,
  name,
  disabled = false,
  label,
}: NumberFieldProps<T>) {
  return (
    <FormFieldWrapper control={control} name={name} label={label}>
      {({ value, onChange }) => (
        <Input
          type="number"
          value={value as number}
          onChange={(e) => onChange(e.target.valueAsNumber || '')}
          disabled={disabled}
        />
      )}
    </FormFieldWrapper>
  )
}

export default NumberField
