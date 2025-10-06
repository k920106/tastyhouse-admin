'use client'

import FaqFormFields from '@/src/app/(dashboard)/faqs/(form)/_components/FaqFormFields'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
import { SpinnerButton } from '@/src/components/ui/SpinnerButton'
import { FAQ_UPDATE_BREADCRUMBS } from '@/src/constants/faq'
import { handleFaqUpdate } from '@/src/lib/api-handlers/faq-handlers'
import { handleFormError } from '@/src/lib/form-utils'
import { faqFormSchema } from '@/src/lib/schemas/faq-schema'
import { Faq, FaqFormInput } from '@/src/types/faq'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { revalidateFaqPaths } from './actions'

interface FaqUpdateProps {
  faq: Faq
}

export default function FaqUpdate({ faq }: FaqUpdateProps) {
  const router = useRouter()

  const form = useForm<FaqFormInput>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      companyId: String(faq.companyId),
      title: faq.title,
      content: faq.content,
      active: faq.active,
      sort: faq.sort,
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FaqFormInput) => {
    try {
      await handleFaqUpdate(faq.id, data)

      toast.success('수정되었습니다')

      await revalidateFaqPaths(faq.id)

      router.back()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.')
    }
  }

  return (
    <PageTemplate breadcrumbs={FAQ_UPDATE_BREADCRUMBS}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
          <Card className="w-full shadow-none">
            <CardContent>
              <FaqFormFields form={form} isSubmitting={isSubmitting} />
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
