'use client'

import PageTemplate from '@/src/components/layout/PageTemplate'
import { Button } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
import { NOTICE_DETAIL_BREADCRUMBS } from '@/src/constants/notice'
import { api } from '@/src/lib/api'
import { handleFormError } from '@/src/lib/form-utils'
import { ApiResponse } from '@/src/types/api'
import { Notice, NoticeUpdateFormInput, NoticeUpdateRequest } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import NoticeFormFields from '../../../_components/NoticeFormFields'
import { revalidateNoticePaths } from './actions'

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
}) satisfies z.ZodType<NoticeUpdateFormInput>

interface NoticeUpdateProps {
  notice: Notice
}

export default function NoticeUpdate({ notice }: NoticeUpdateProps) {
  const router = useRouter()

  const form = useForm<NoticeUpdateFormInput>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      companyId: String(notice.companyId),
      title: notice.title,
      content: notice.content,
      active: notice.active,
      top: notice.top,
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: NoticeUpdateFormInput) => {
    try {
      const request: NoticeUpdateRequest = {
        companyId: Number(data.companyId),
        title: data.title,
        content: data.content,
        active: data.active,
        top: data.top,
      }

      const response = await api.put<ApiResponse<null>>(`/notices/${notice.id}`, request)
      if (!response.success) {
        toast.error(response.message || '수정에 실패했습니다. 다시 시도해 주세요.')
        return
      }

      toast.success('수정되었습니다')

      await revalidateNoticePaths(notice.id)

      router.back()
    } catch (error) {
      console.error('공지사항 수정 실패:', error)
      toast.error(
        error instanceof Error ? error.message : '수정에 실패하였습니다. 다시 시도해 주세요.',
      )
    }
  }

  return (
    <PageTemplate breadcrumbs={NOTICE_DETAIL_BREADCRUMBS}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
          <Card className="w-full shadow-none">
            <CardContent>
              <NoticeFormFields form={form} isSubmitting={isSubmitting} />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '수정 중...' : '수정'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </PageTemplate>
  )
}
