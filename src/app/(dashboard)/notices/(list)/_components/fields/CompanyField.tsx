import { Control } from 'react-hook-form'

import CompanySelector from '@/src/components/forms/CompanySelector'
import FormFieldWrapper from '@/src/components/forms/FormFieldWrapper'
import { NoticeSearchFormInput } from '@/src/types/notice'

interface CompanyFieldProps {
  control: Control<NoticeSearchFormInput>
  isLoading: boolean
}

export default function CompanyField({ control, isLoading = false }: CompanyFieldProps) {
  return (
    <FormFieldWrapper name="companyId" label="매체사" control={control}>
      {({ value, onChange }) => (
        <CompanySelector value={value as string} onValueChange={onChange} loading={isLoading} />
      )}
    </FormFieldWrapper>
  )
}
