'use client'

import ActiveStatusSwitchField from '@/src/components/forms/ActiveStatusSwitchField'
import CompanyField from '@/src/components/forms/CompanyField'
import SwitchField from '@/src/components/forms/SwitchField'
import TextField from '@/src/components/forms/TextField'
import TextareaField from '@/src/components/forms/TextareaField'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Button } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
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
      <Card className={'w-full shadow-none'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
            <CardContent>
              <div className="space-y-6">
                <CompanyField control={form.control} name="companyId" isLoading={isSubmitting} />
                <ActiveStatusSwitchField control={form.control} name="active" />
                <SwitchField control={form.control} name="top" label="상단 고정" />
                <TextField
                  name="title"
                  label="제목"
                  control={form.control}
                  isLoading={isSubmitting}
                />
                <TextareaField
                  name="content"
                  label="내용"
                  control={form.control}
                  isLoading={isSubmitting}
                  rows={15}
                />
              </div>
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
