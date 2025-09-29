import React from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'

interface FormFieldWrapperProps<T extends FieldValues> {
  name: FieldPath<T>
  label: string
  control: Control<T>
  children: (field: { value: unknown; onChange: (value: unknown) => void }) => React.ReactNode
}

export default function FormFieldWrapper<T extends FieldValues>({
  name,
  label,
  control,
  children,
}: FormFieldWrapperProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            {children({
              value: field.value ?? '',
              onChange: field.onChange,
            })}
          </FormControl>
        </FormItem>
      )}
    />
  )
}
