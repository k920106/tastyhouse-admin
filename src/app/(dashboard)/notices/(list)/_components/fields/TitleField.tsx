import { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'
import { NoticeSearchForm } from '@/src/types/notice'

interface TitleFieldProps {
  control: Control<NoticeSearchForm>
  isLoading: boolean
}

export default function TitleField({ control, isLoading = false }: TitleFieldProps) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">제목</FormLabel>
          <FormControl>
            <Input
              type="text"
              value={field.value ?? ''}
              onChange={field.onChange}
              disabled={isLoading}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
