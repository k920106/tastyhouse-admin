'use client'

import PageTemplate from '@/src/components/layout/PageTemplate'
import { Button } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
import { INITIAL_NOTICE_CREATE_FORM, NOTICE_CREATE_BREADCRUMBS } from '@/src/constants/notice'
import { api } from '@/src/lib/api'
import { handleFormError } from '@/src/lib/form-utils'
import { noticeFormSchema } from '@/src/lib/schemas/notice-schema'
import { ApiResponse } from '@/src/types/api'
import { NoticeCreateRequest, NoticeCreateResponse, NoticeFormInput } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import NoticeFormFields from '../../_components/NoticeFormFields'

export default function NoticeCreate() {
  const router = useRouter()

  const form = useForm<NoticeFormInput>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: INITIAL_NOTICE_CREATE_FORM,
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: NoticeFormInput) => {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
          <Card className="w-full shadow-none">
            <CardContent>
              <NoticeFormFields form={form} isSubmitting={isSubmitting} />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '등록'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </PageTemplate>
  )
}
