import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import NumberField from '@/src/components/forms/field/NumberField'
import SwitchField from '@/src/components/forms/field/SwitchField'
import TextField from '@/src/components/forms/field/TextField'
import TextareaField from '@/src/components/forms/field/TextareaField'
import { FormControl, FormField, FormItem, FormMessage } from '@/src/components/ui/Form'
import { FaqFormInput } from '@/src/types/faq'
import { UseFormReturn } from 'react-hook-form'

interface FaqFormFieldsProps {
  form: UseFormReturn<FaqFormInput>
  isSubmitting: boolean
}

export default function FaqFormFields({ form, isSubmitting }: FaqFormFieldsProps) {
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
            <SwitchField control={form.control} name="active" label="" disabled={isSubmitting} />
          </DetailTableField>
        </DetailTableDoubleRow>
        <DetailTableDoubleRow>
          <DetailTableField label="우선순위">
            <NumberField control={form.control} name="sort" disabled={isSubmitting} label="" />
          </DetailTableField>
          <DetailTableField label="제목">
            <TextField control={form.control} name="title" disabled={isSubmitting} label="" />
          </DetailTableField>
        </DetailTableDoubleRow>
        <DetailTableRow label="내용">
          <TextareaField
            control={form.control}
            name="content"
            disabled={isSubmitting}
            label=""
            rows={15}
          />
        </DetailTableRow>
      </tbody>
    </table>
  )
}
