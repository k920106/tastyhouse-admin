import { Control } from 'react-hook-form'

import CompanySelector from '@/src/components/forms/CompanySelector'
import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { NoticeSearchForm } from '@/src/types/notice'

interface CompanyFieldProps {
  control: Control<NoticeSearchForm>
  isLoading: boolean
}

export default function CompanyField({ control, isLoading = false }: CompanyFieldProps) {
  return (
    <FormField
      control={control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">매체사</FormLabel>
          <FormControl>
            <CompanySelector
              label=""
              value={field.value ?? ''}
              onValueChange={field.onChange}
              loading={isLoading}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
