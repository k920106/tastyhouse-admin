'use client'

import CompanySelector from '@/src/components/forms/CompanySelector'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { Button } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'
import { Switch } from '@/src/components/ui/Switch'
import { Textarea } from '@/src/components/ui/Textarea'
import { NOTICE_CREATE_BREADCRUMBS } from '@/src/constants/notice'
import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { NoticeCreateRequest } from '@/src/types/notice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const noticeFormSchema = z.object({
  companyId: z.string().min(1, '매체사를 선택해주세요'),
  isUse: z.boolean(),
  isTop: z.boolean(),
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
})

type NoticeFormData = z.infer<typeof noticeFormSchema>

export default function NoticeCreate() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      companyId: '',
      isUse: false,
      isTop: false,
      title: '',
      content: '',
    },
  })

  const onSubmit = async (data: NoticeFormData) => {
    try {
      setIsLoading(true)

      const requestData: NoticeCreateRequest = {
        companyId: parseInt(data.companyId),
        isUse: data.isUse,
        isTop: data.isTop,
        title: data.title,
        content: data.content,
      }

      const response = await api.post<ApiResponse>('/notices', requestData)
      if (response.success) {
        toast.success('등록되었습니다')
        form.reset()
      }
    } catch (error) {
      console.error('공지사항 등록 실패:', error)
      toast.error(
        error instanceof Error ? error.message : '등록에 실패하였습니다. 다시 시도해주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTemplate breadcrumbs={NOTICE_CREATE_BREADCRUMBS}>
      <Card className={'w-full shadow-none'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              const firstError = Object.values(errors)[0]
              if (firstError?.message) {
                toast.error(firstError.message)
              }
            })}
            className="space-y-6"
          >
            <CardContent>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">매체사</FormLabel>
                      <FormControl>
                        <CompanySelector
                          label=""
                          value={field.value}
                          onValueChange={field.onChange}
                          loading={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* 기존 RadioGroup 코드 주석 처리
                <FormField
                  control={form.control}
                  name="isUse"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-semibold">사용 여부</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem id="use" value="true" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="use">
                              {NOTICE_USE_STATUS.USE.label}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem id="not-use" value="false" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="not-use">
                              {NOTICE_TOP_STATUS.NOT_USE.label}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                */}
                <FormField
                  control={form.control}
                  name="isUse"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold">사용 여부</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* 기존 상단 고정 RadioGroup 코드 주석 처리
                <FormField
                  control={form.control}
                  name="isTop"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-semibold">상단 고정</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem id="top" value="true" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="top">
                              {NOTICE_TOP_STATUS.TOP.label}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem id="not-top" value="false" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="not-top">
                              {NOTICE_TOP_STATUS.NOT_TOP.label}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                */}
                <FormField
                  control={form.control}
                  name="isTop"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold">상단 고정</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">제목</FormLabel>
                      <FormControl>
                        <Input type="text" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">내용</FormLabel>
                      <FormControl>
                        <Textarea
                          id="content"
                          value={field.value}
                          onChange={field.onChange}
                          rows={15}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '등록 중...' : '등록'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </PageTemplate>
  )
}
