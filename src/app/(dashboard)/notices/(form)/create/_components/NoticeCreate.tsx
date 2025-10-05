'use client'

import CompanyCombobox from '@/src/components/forms/CompanyCombobox'
import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Button } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'

import { Switch } from '@/src/components/ui/Switch'
import { Textarea } from '@/src/components/ui/Textarea'
import { INITIAL_NOTICE_CREATE_FORM, NOTICE_CREATE_BREADCRUMBS } from '@/src/constants/notice'
import { api } from '@/src/lib/api'
import { handleFormError } from '@/src/lib/form-utils'
import { ApiResponse } from '@/src/types/api'
import {
  NoticeCreateFormInput,
  NoticeCreateRequest,
  NoticeCreateResponse,
} from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const noticeFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  title: z.string().min(1, '제목을 입력해 주세요'),
  content: z.string().min(1, '내용을 입력해 주세요'),
  active: z.boolean(),
  top: z.boolean(),
}) satisfies z.ZodType<NoticeCreateFormInput>

export default function NoticeCreate() {
  const router = useRouter()

  const form = useForm<NoticeCreateFormInput>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: INITIAL_NOTICE_CREATE_FORM,
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: NoticeCreateFormInput) => {
    try {
      const request: NoticeCreateRequest = {
        companyId: Number(data.companyId),
        title: data.title,
        content: data.content,
        active: data.active,
        top: data.top,
      }

      const response = await api.post<ApiResponse<NoticeCreateResponse>>('/notices', request)
      if (!response.success || !response.data) {
        toast.error(response.message || '등록에 실패했습니다. 다시 시도해 주세요.')
        return
      }

      toast.success('등록되었습니다')
      router.push(`/notices/${response.data.id}`)
    } catch (error) {
      console.error('공지사항 등록 실패:', error)
      toast.error(
        error instanceof Error ? error.message : '등록에 실패하였습니다. 다시 시도해 주세요.',
      )
    }
  }

  return (
    <PageTemplate breadcrumbs={NOTICE_CREATE_BREADCRUMBS}>
      <Card className="w-full shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
            <CardContent>
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
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
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
                            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
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
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '등록'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </PageTemplate>
  )
}
