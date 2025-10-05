import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import { FormControl, FormField, FormItem, FormMessage } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'
import { Switch } from '@/src/components/ui/Switch'
import { Textarea } from '@/src/components/ui/Textarea'
import { NoticeCreateFormInput } from '@/src/types/notice'
import { UseFormReturn } from 'react-hook-form'

interface NoticeFormFieldsProps {
  form: UseFormReturn<NoticeCreateFormInput>
  isSubmitting: boolean
}

export default function NoticeFormFields({ form, isSubmitting }: NoticeFormFieldsProps) {
  return (
    <table className="w-full border-collapse">
      <tbody className="border">
        <DetailTableDoubleRow>
          <DetailTableField label="매체사">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CompanyCombobox
                      value={field.value as string}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DetailTableField>
          <DetailTableField label="활성상태">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DetailTableField>
        </DetailTableDoubleRow>
        <DetailTableRow label="상단 고정">
          <FormField
            control={form.control}
            name="top"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DetailTableRow>
        <DetailTableRow label="제목">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DetailTableRow>
        <DetailTableRow label="내용">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} disabled={isSubmitting} rows={15} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DetailTableRow>
      </tbody>
    </table>
  )
}
