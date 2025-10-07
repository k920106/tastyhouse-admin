import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import CompanyField from '@/src/components/forms/field/CompanyField'
import SwitchField from '@/src/components/forms/field/SwitchField'
import TextField from '@/src/components/forms/field/TextField'
import TextareaField from '@/src/components/forms/field/TextareaField'
import { NoticeFormInput } from '@/src/types/notice'
import { UseFormReturn } from 'react-hook-form'

interface NoticeFormFieldsProps {
  form: UseFormReturn<NoticeFormInput>
  isSubmitting: boolean
}

export default function NoticeFormFields({ form, isSubmitting }: NoticeFormFieldsProps) {
  return (
    <table className="w-full border-collapse">
      <tbody className="border">
        <DetailTableDoubleRow>
          <DetailTableField label="매체사">
            <CompanyField control={form.control} name="companyId" disabled={isSubmitting} />
          </DetailTableField>
          <DetailTableField label="활성상태">
            <SwitchField control={form.control} name="active" disabled={isSubmitting} />
          </DetailTableField>
        </DetailTableDoubleRow>
        <DetailTableRow label="상단 고정">
          <SwitchField control={form.control} name="top" disabled={isSubmitting} />
        </DetailTableRow>
        <DetailTableRow label="제목">
          <TextField control={form.control} name="title" disabled={isSubmitting} />
        </DetailTableRow>
        <DetailTableRow label="내용">
          <TextareaField control={form.control} name="content" disabled={isSubmitting} rows={15} />
        </DetailTableRow>
      </tbody>
    </table>
  )
}
