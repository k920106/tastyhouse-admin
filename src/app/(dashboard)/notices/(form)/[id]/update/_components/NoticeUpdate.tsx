'use client'

import NoticeFormFields from '@/src/app/(dashboard)/notices/(form)/_components/NoticeFormFields'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
import { SpinnerButton } from '@/src/components/ui/SpinnerButton'
import { NOTICE_UPDATE_BREADCRUMBS } from '@/src/constants/notice'
import { handleNoticeUpdate } from '@/src/lib/api-handlers/notice-handlers'
import { handleFormError } from '@/src/lib/form-utils'
import { noticeFormSchema } from '@/src/lib/schemas/notice-schema'
import { Notice, NoticeFormInput } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { revalidateNoticePaths } from './actions'

interface NoticeUpdateProps {
  notice: Notice
}

export default function NoticeUpdate({ notice }: NoticeUpdateProps) {
  const router = useRouter()

  const form = useForm<NoticeFormInput>({
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

  const onSubmit = async (data: NoticeFormInput) => {
    try {
      await handleNoticeUpdate(notice.id, data)

      toast.success('수정되었습니다')

      await revalidateNoticePaths(notice.id)

      router.back()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.')
    }
  }

  return (
    <PageTemplate breadcrumbs={NOTICE_UPDATE_BREADCRUMBS}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
          <Card className="w-full shadow-none">
            <CardContent>
              <NoticeFormFields form={form} isSubmitting={isSubmitting} />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <SpinnerButton type="submit" isLoading={isSubmitting}>
                등록
              </SpinnerButton>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </PageTemplate>
  )
}
