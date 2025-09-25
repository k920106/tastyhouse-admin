import { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { NoticeActiveFilter, NoticeSearchFormInput, getNoticeUseStatusLabel } from '@/src/types/notice'

interface ActiveStatusFieldProps {
  control: Control<NoticeSearchFormInput>
  isLoading: boolean
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
              value={(field.value as NoticeActiveFilter) ?? 'all'}
              onValueChange={(value: NoticeActiveFilter) => field.onChange(value)}
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
