'use client'

import FaqFormFields from '@/src/app/(dashboard)/faqs/(form)/_components/FaqFormFields'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form } from '@/src/components/ui/Form'
import { SpinnerButton } from '@/src/components/ui/SpinnerButton'
import { FAQ_CREATE_BREADCRUMBS, INITIAL_FAQ_CREATE_FORM } from '@/src/constants/faq'
import { handleFaqCreate } from '@/src/lib/api-handlers/faq-handlers'
import { handleFormError } from '@/src/lib/form-utils'
import { faqFormSchema } from '@/src/lib/schemas/faq-schema'
import { FaqFormInput } from '@/src/types/faq'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function FaqCreate() {
  const router = useRouter()

  const form = useForm<FaqFormInput>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: INITIAL_FAQ_CREATE_FORM,
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FaqFormInput) => {
    try {
      const result = await handleFaqCreate(data)

      toast.success('등록되었습니다')

      router.push(`/faqs/${result.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.')
    }
  }

  return (
    <PageTemplate breadcrumbs={FAQ_CREATE_BREADCRUMBS}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
          <Card className="w-full shadow-none">
            <CardContent>
              <FaqFormFields form={form} isSubmitting={isSubmitting} />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <SpinnerButton
                type="submit"
                idleLabel="등록"
                loadingLabel="등록 중..."
                isLoading={isSubmitting}
              />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </PageTemplate>
  )
}
