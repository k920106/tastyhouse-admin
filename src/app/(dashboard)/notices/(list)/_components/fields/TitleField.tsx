import { Control } from 'react-hook-form'

import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { Input } from '@/src/components/ui/Input'
import { NoticeSearchFormInput } from '@/src/types/notice'

interface TitleFieldProps {
  control: Control<NoticeSearchFormInput>
  isLoading: boolean
}

export default function TitleField({ control, isLoading = false }: TitleFieldProps) {
  return (
    <FormFieldWrapper
      name="title"
      label="제목"
      control={control}
    >
      {({ value, onChange }) => (
        <Input
          type="text"
          value={value as string}
          onChange={onChange}
          disabled={isLoading}
        />
      )}
    </FormFieldWrapper>
  )
}
