import { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { getNoticeUseStatusLabel, NoticeSearchForm } from '@/src/types/notice'

interface ActiveStatusFieldProps {
  control: Control<NoticeSearchForm>
  isLoading?: boolean
}

export default function ActiveStatusField({ control, isLoading = false }: ActiveStatusFieldProps) {
  return (
    <FormField
      control={control}
      name="active"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">사용 여부</FormLabel>
          <FormControl>
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="true">{getNoticeUseStatusLabel(true)}</SelectItem>
                <SelectItem value="false">{getNoticeUseStatusLabel(false)}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
